import * as THREE from 'three';
import { BeybladeStore } from '../stores/BeybladeStore';
import { PartData, SectorData, ViewMode } from '../types/beybladeTypes';
import { getSectorBuilder } from '../geometry/sectorBuilders';

const AXIS_COLOR   = 0x00e5ff;
const EDGE_COLOR   = 0xffffff;
const PIVOT_COLOR  = 0xff6b35;
const GROUND_COLOR = 0x2a2a4a;
const AXIS_RADIUS  = 0.05; // cm

function partAsSector(p: PartData): SectorData {
  return {
    id: p.id, name: p.name,
    startAngle: 0, endAngle: 360,
    height: p.height,
    topRadiusX: p.topRadiusX,    topRadiusZ: p.topRadiusZ,
    bottomRadiusX: p.bottomRadiusX, bottomRadiusZ: p.bottomRadiusZ,
    isHollow: p.isHollow,
    innerTopRadiusX: p.innerTopRadiusX,    innerTopRadiusZ: p.innerTopRadiusZ,
    innerBottomRadiusX: p.innerBottomRadiusX, innerBottomRadiusZ: p.innerBottomRadiusZ,
    material: p.material, weight: p.weight, color: p.color,
  };
}

type OwnerGroup = 'spin' | 'free';

interface PartObjects {
  hitboxMesh:  THREE.Object3D;
  hitboxEdges: THREE.Object3D;
  presentMesh: THREE.Object3D | null;
  owner: OwnerGroup;
}

export class BeybladeRenderer {
  // pivotAnchor is the outer group: positioned at y=pivotOffset and X-tilted.
  // axisRoot is a child of pivotAnchor positioned at y=-pivotOffset, so parts
  // always sit at their world axisOffsetY regardless of pivot changes.
  private readonly pivotAnchor = new THREE.Group();
  readonly axisRoot      = new THREE.Group();
  readonly spinGroup     = new THREE.Group();
  readonly freeSpinGroup = new THREE.Group();

  private axisLine:    THREE.Mesh;
  private pivotMarker: THREE.Mesh;
  private groundDisc:  THREE.Mesh;

  private partObjects = new Map<string, PartObjects>();
  private viewMode: ViewMode = 'hitbox';

  // Single shared material for all edge line segments — disposed once in dispose().
  private readonly sharedEdgeMat = new THREE.LineBasicMaterial({
    color: EDGE_COLOR, transparent: true, opacity: 0.35,
  });

  constructor(private scene: THREE.Scene, private store: BeybladeStore) {
    this.pivotAnchor.add(this.axisRoot);
    this.axisRoot.add(this.spinGroup, this.freeSpinGroup);
    scene.add(this.pivotAnchor);

    const axisGeo  = new THREE.CylinderGeometry(AXIS_RADIUS, AXIS_RADIUS, 40, 12);
    const axisMat  = new THREE.MeshBasicMaterial({ color: AXIS_COLOR, transparent: true, opacity: 0.5 });
    this.axisLine  = new THREE.Mesh(axisGeo, axisMat);

    const pivotGeo = new THREE.SphereGeometry(0.3, 12, 12);
    const pivotMat = new THREE.MeshBasicMaterial({ color: PIVOT_COLOR });
    this.pivotMarker = new THREE.Mesh(pivotGeo, pivotMat);

    const discGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.05, 32);
    const discMat = new THREE.MeshBasicMaterial({ color: GROUND_COLOR, transparent: true, opacity: 0.6 });
    this.groundDisc = new THREE.Mesh(discGeo, discMat);

    this.axisRoot.add(this.axisLine, this.pivotMarker, this.groundDisc);
    this.rebuildAxis();
  }

  // ── Axis pose ─────────────────────────────────────────────────────────────

  setAxisPose(tiltAngle: number, pivotOffset: number): void {
    // pivotAnchor lifts to the tilt center and rotates; axisRoot counter-offsets
    // back down so parts remain at their world axisOffsetY regardless of pivot.
    this.pivotAnchor.position.y = pivotOffset;
    this.pivotAnchor.rotation.x = THREE.MathUtils.degToRad(tiltAngle);
    this.axisRoot.position.y    = -pivotOffset;
    // Pivot marker sits at pivot height in axisRoot local space (world y = pivotOffset)
    this.pivotMarker.position.y = pivotOffset;
    // Ground disc stays at world y = 0 (axisRoot local y = 0)
    this.groundDisc.position.y  = 0;
  }

  rebuildAxis(): void {
    const axis = this.store.getAxis();
    this.setAxisPose(axis.tiltAngle, axis.pivotOffset);
  }

  // ── Part meshes ───────────────────────────────────────────────────────────

  rebuildPart(id: string): void {
    this._disposePartObjects(id);
    const part = this.store.getPart(id);
    const hitboxMesh  = this._buildHitboxMesh(part);
    const hitboxEdges = this._buildHitboxEdges(part);
    const presentMesh = null; // loaded asynchronously via loadPresentationSTL()

    hitboxMesh.position.y  = part.axisOffsetY;
    hitboxEdges.position.y = part.axisOffsetY;

    const owner: OwnerGroup = part.freeSpin ? 'free' : 'spin';
    const group = owner === 'free' ? this.freeSpinGroup : this.spinGroup;
    group.add(hitboxMesh, hitboxEdges);

    this.partObjects.set(id, { hitboxMesh, hitboxEdges, presentMesh, owner });
    this._applyViewMode(id);
  }

  rebuildSector(sectorId: string): void {
    const partId = this.store.findPartOfSector(sectorId);
    if (partId) this.rebuildPart(partId);
  }

  removePart(id: string): void {
    this._disposePartObjects(id);
  }

  // Re-assign parts to correct spin/freeSpin group when freeSpin flag changes.
  updateSpinGroups(): void {
    for (const part of this.store.getAllParts()) {
      const objs = this.partObjects.get(part.id);
      if (!objs) continue;
      const newOwner: OwnerGroup = part.freeSpin ? 'free' : 'spin';
      if (objs.owner === newOwner) continue; // already in the right group
      const from = objs.owner === 'free' ? this.freeSpinGroup : this.spinGroup;
      const to   = newOwner  === 'free' ? this.freeSpinGroup : this.spinGroup;
      from.remove(objs.hitboxMesh, objs.hitboxEdges);
      if (objs.presentMesh) from.remove(objs.presentMesh);
      to.add(objs.hitboxMesh, objs.hitboxEdges);
      if (objs.presentMesh) to.add(objs.presentMesh);
      objs.owner = newOwner;
    }
  }

  // ── View mode ─────────────────────────────────────────────────────────────

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    for (const id of this.partObjects.keys()) this._applyViewMode(id);
  }

  // ── Visibility ────────────────────────────────────────────────────────────

  setPartVisible(id: string, visible: boolean): void {
    const objs = this.partObjects.get(id);
    if (!objs) return;
    objs.hitboxMesh.visible  = visible && this.viewMode !== 'present';
    objs.hitboxEdges.visible = visible && this.viewMode !== 'present';
    if (objs.presentMesh) objs.presentMesh.visible = visible && this.viewMode !== 'hitbox';
  }

  // ── Disposal ─────────────────────────────────────────────────────────────

  dispose(): void {
    for (const id of [...this.partObjects.keys()]) this._disposePartObjects(id);
    this.scene.remove(this.pivotAnchor);
    this._disposeMeshObj(this.axisLine);
    this._disposeMeshObj(this.pivotMarker);
    this._disposeMeshObj(this.groundDisc);
    this.sharedEdgeMat.dispose();
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private _buildHitboxMesh(part: PartData): THREE.Object3D {
    if (part.sectorIds.length === 0) {
      const builder = getSectorBuilder(part.isHollow);
      const geo = builder.buildMeshGeometry(partAsSector(part));
      const mat = new THREE.MeshStandardMaterial({
        color: part.color, side: THREE.DoubleSide,
        roughness: 0.6, metalness: part.material === 'metal' ? 0.6 : 0.1,
      });
      return new THREE.Mesh(geo, mat);
    }
    const grp = new THREE.Group();
    for (const sid of part.sectorIds) {
      const sector = this.store.getSector(sid);
      const builder = getSectorBuilder(sector.isHollow);
      const geo = builder.buildMeshGeometry(sector);
      const mat = new THREE.MeshStandardMaterial({
        color: sector.color, side: THREE.DoubleSide,
        roughness: 0.6, metalness: sector.material === 'metal' ? 0.6 : 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData['sectorId'] = sid;
      grp.add(mesh);
    }
    return grp;
  }

  private _buildHitboxEdges(part: PartData): THREE.Object3D {
    if (part.sectorIds.length === 0) {
      const builder = getSectorBuilder(part.isHollow);
      const geo = builder.buildEdgeGeometry(partAsSector(part));
      return new THREE.LineSegments(geo, this.sharedEdgeMat);
    }
    const grp = new THREE.Group();
    for (const sid of part.sectorIds) {
      const sector = this.store.getSector(sid);
      const builder = getSectorBuilder(sector.isHollow);
      const geo = builder.buildEdgeGeometry(sector);
      grp.add(new THREE.LineSegments(geo, this.sharedEdgeMat));
    }
    return grp;
  }

  loadPresentationSTL(id: string, geometry: THREE.BufferGeometry): void {
    const part = this.store.getPart(id);
    const objs = this.partObjects.get(id);
    if (!objs) return;
    if (objs.presentMesh) {
      const fromGroup = objs.owner === 'free' ? this.freeSpinGroup : this.spinGroup;
      fromGroup.remove(objs.presentMesh);
      this._disposeMeshObj(objs.presentMesh);
    }
    const cfg = part.present;
    const mat = new THREE.MeshStandardMaterial({
      color: cfg.color, side: THREE.DoubleSide,
      roughness: 0.5, metalness: 0.1,
    });
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(cfg.offX, part.axisOffsetY + cfg.offY, cfg.offZ);
    mesh.rotation.set(
      THREE.MathUtils.degToRad(cfg.rotX),
      THREE.MathUtils.degToRad(cfg.rotY),
      THREE.MathUtils.degToRad(cfg.rotZ),
    );
    mesh.scale.set(cfg.scaleX, cfg.scaleY, cfg.scaleZ);
    const group = objs.owner === 'free' ? this.freeSpinGroup : this.spinGroup;
    group.add(mesh);
    objs.presentMesh = mesh;
    this._applyViewMode(id);
  }

  applyPresentTransform(id: string): void {
    const part = this.store.getPart(id);
    const objs = this.partObjects.get(id);
    if (!objs?.presentMesh) return;
    const cfg = part.present;
    objs.presentMesh.position.set(cfg.offX, part.axisOffsetY + cfg.offY, cfg.offZ);
    objs.presentMesh.rotation.set(
      THREE.MathUtils.degToRad(cfg.rotX),
      THREE.MathUtils.degToRad(cfg.rotY),
      THREE.MathUtils.degToRad(cfg.rotZ),
    );
    objs.presentMesh.scale.set(cfg.scaleX, cfg.scaleY, cfg.scaleZ);
    ((objs.presentMesh as THREE.Mesh).material as THREE.MeshStandardMaterial).color.setHex(cfg.color);
  }

  clearPresentMesh(id: string): void {
    const objs = this.partObjects.get(id);
    if (!objs?.presentMesh) return;
    const group = objs.owner === 'free' ? this.freeSpinGroup : this.spinGroup;
    group.remove(objs.presentMesh);
    this._disposeMeshObj(objs.presentMesh);
    objs.presentMesh = null;
    this._applyViewMode(id);
  }

  private _applyViewMode(id: string): void {
    const objs = this.partObjects.get(id);
    if (!objs) return;
    const showHitbox  = this.viewMode !== 'present';
    const showPresent = this.viewMode !== 'hitbox';
    objs.hitboxMesh.visible  = showHitbox;
    objs.hitboxEdges.visible = showHitbox;
    if (objs.presentMesh) objs.presentMesh.visible = showPresent;
  }

  private _disposePartObjects(id: string): void {
    const objs = this.partObjects.get(id);
    if (!objs) return;
    // Remove only from the tracked owner group (not both).
    const group = objs.owner === 'free' ? this.freeSpinGroup : this.spinGroup;
    group.remove(objs.hitboxMesh, objs.hitboxEdges);
    this._disposeMeshObj(objs.hitboxMesh);
    this._disposeEdgeObj(objs.hitboxEdges); // geometry only — sharedEdgeMat stays alive
    if (objs.presentMesh) {
      group.remove(objs.presentMesh);
      this._disposeMeshObj(objs.presentMesh);
    }
    this.partObjects.delete(id);
  }

  // Dispose geometry + materials for mesh objects.
  private _disposeMeshObj(obj: THREE.Object3D): void {
    obj.traverse(child => {
      const c = child as THREE.Mesh;
      if (c.geometry) c.geometry.dispose();
      if (c.material) {
        const mats = Array.isArray(c.material) ? c.material : [c.material];
        mats.forEach(m => m.dispose());
      }
    });
  }

  // Dispose geometry only for edge objects that share sharedEdgeMat.
  private _disposeEdgeObj(obj: THREE.Object3D): void {
    obj.traverse(child => {
      const c = child as THREE.LineSegments;
      if (c.geometry) c.geometry.dispose();
    });
  }
}
