import * as THREE from 'three';
import { BeybladeStore } from '../stores/BeybladeStore';
import { PartData, SectorData, ViewMode } from '../types/beybladeTypes';
import { getSectorBuilder } from '../geometry/sectorBuilders';

const AXIS_COLOR  = 0x00e5ff;
const EDGE_COLOR  = 0xffffff;
const PIVOT_COLOR = 0xff6b35;
const GROUND_COLOR = 0x2a2a4a;
const AXIS_RADIUS = 0.05; // cm

// Convert a PartData into a full-circle SectorData for rendering when unsectored.
function partAsSector(p: PartData): SectorData {
  return {
    id: p.id, name: p.name,
    startAngle: 0, endAngle: 360,
    height: p.height,
    topRadiusX: p.topRadiusX, topRadiusZ: p.topRadiusZ,
    bottomRadiusX: p.bottomRadiusX, bottomRadiusZ: p.bottomRadiusZ,
    isHollow: p.isHollow,
    innerTopRadiusX: p.innerTopRadiusX, innerTopRadiusZ: p.innerTopRadiusZ,
    innerBottomRadiusX: p.innerBottomRadiusX, innerBottomRadiusZ: p.innerBottomRadiusZ,
    material: p.material, weight: p.weight, color: p.color,
  };
}

interface PartObjects {
  hitboxMesh:  THREE.Object3D;
  hitboxEdges: THREE.Object3D;
  presentMesh: THREE.Object3D | null;
}

export class BeybladeRenderer {
  readonly axisRoot       = new THREE.Group();
  readonly spinGroup      = new THREE.Group();
  readonly freeSpinGroup  = new THREE.Group();

  private axisLine:    THREE.Mesh;
  private pivotMarker: THREE.Mesh;
  private groundDisc:  THREE.Mesh;

  private partObjects = new Map<string, PartObjects>();
  private viewMode: ViewMode = 'hitbox';

  constructor(private scene: THREE.Scene, private store: BeybladeStore) {
    this.axisRoot.add(this.spinGroup, this.freeSpinGroup);
    scene.add(this.axisRoot);

    // Axis rod (thin cylinder along Y from -20cm to +20cm relative to axisRoot)
    const axisGeo  = new THREE.CylinderGeometry(AXIS_RADIUS, AXIS_RADIUS, 40, 12);
    const axisMat  = new THREE.MeshBasicMaterial({ color: AXIS_COLOR, transparent: true, opacity: 0.5 });
    this.axisLine  = new THREE.Mesh(axisGeo, axisMat);
    this.axisLine.position.y = 0; // centred at pivot

    // Pivot marker (small sphere)
    const pivotGeo = new THREE.SphereGeometry(0.3, 12, 12);
    const pivotMat = new THREE.MeshBasicMaterial({ color: PIVOT_COLOR });
    this.pivotMarker = new THREE.Mesh(pivotGeo, pivotMat);

    // Ground contact disc (thin flat disc)
    const discGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.05, 32);
    const discMat = new THREE.MeshBasicMaterial({ color: GROUND_COLOR, transparent: true, opacity: 0.6 });
    this.groundDisc = new THREE.Mesh(discGeo, discMat);

    this.axisRoot.add(this.axisLine, this.pivotMarker, this.groundDisc);
    this.rebuildAxis();
  }

  // ── Axis pose (called by animator) ───────────────────────────────────────

  setAxisPose(tiltAngle: number, pivotOffset: number): void {
    this.axisRoot.position.y = pivotOffset;
    this.axisRoot.rotation.x = THREE.MathUtils.degToRad(tiltAngle);
    // Ground disc stays at world-space Y=0: translate it back down
    this.groundDisc.position.y = -pivotOffset;
    // Pivot marker at local Y=0 (the pivot point)
    this.pivotMarker.position.y = 0;
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
    const presentMesh = this._buildPresentationMesh(part);

    hitboxMesh.position.y  = part.axisOffsetY;
    hitboxEdges.position.y = part.axisOffsetY;
    if (presentMesh) presentMesh.position.y = part.axisOffsetY;

    const group = part.freeSpin ? this.freeSpinGroup : this.spinGroup;
    group.add(hitboxMesh, hitboxEdges);
    if (presentMesh) group.add(presentMesh);

    this.partObjects.set(id, { hitboxMesh, hitboxEdges, presentMesh });
    this._applyViewMode(id);
  }

  rebuildSector(sectorId: string): void {
    // Find which part owns this sector
    for (const part of this.store.getAllParts()) {
      if (part.sectorIds.includes(sectorId)) {
        this.rebuildPart(part.id);
        return;
      }
    }
  }

  removePart(id: string): void {
    this._disposePartObjects(id);
  }

  updateSpinGroups(): void {
    // Re-assign all parts to the correct spin/freeSpin group
    for (const part of this.store.getAllParts()) {
      const objs = this.partObjects.get(part.id);
      if (!objs) continue;
      const target = part.freeSpin ? this.freeSpinGroup : this.spinGroup;
      target.add(objs.hitboxMesh, objs.hitboxEdges);
      if (objs.presentMesh) target.add(objs.presentMesh);
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
    this.scene.remove(this.axisRoot);
    this._disposeObj(this.axisLine);
    this._disposeObj(this.pivotMarker);
    this._disposeObj(this.groundDisc);
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
    const edgeMat = new THREE.LineBasicMaterial({ color: EDGE_COLOR, transparent: true, opacity: 0.35 });
    if (part.sectorIds.length === 0) {
      const builder = getSectorBuilder(part.isHollow);
      const geo = builder.buildEdgeGeometry(partAsSector(part));
      return new THREE.LineSegments(geo, edgeMat.clone());
    }
    const grp = new THREE.Group();
    for (const sid of part.sectorIds) {
      const sector = this.store.getSector(sid);
      const builder = getSectorBuilder(sector.isHollow);
      const geo = builder.buildEdgeGeometry(sector);
      grp.add(new THREE.LineSegments(geo, edgeMat.clone()));
    }
    return grp;
  }

  private _buildPresentationMesh(_part: PartData): THREE.Object3D | null {
    // STL presentation meshes are loaded asynchronously and attached later.
    // When presentationSTLb64 is set, the caller should invoke loadPresentationSTL().
    return null;
  }

  loadPresentationSTL(id: string, geometry: THREE.BufferGeometry): void {
    const part = this.store.getPart(id);
    const objs = this.partObjects.get(id);
    if (!objs) return;
    if (objs.presentMesh) {
      const group = part.freeSpin ? this.freeSpinGroup : this.spinGroup;
      group.remove(objs.presentMesh);
      this._disposeObj(objs.presentMesh);
    }
    const mat = new THREE.MeshStandardMaterial({
      color: part.presentationColor, side: THREE.DoubleSide,
      roughness: 0.5, metalness: 0.1,
    });
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.y = part.axisOffsetY;
    const group = part.freeSpin ? this.freeSpinGroup : this.spinGroup;
    group.add(mesh);
    objs.presentMesh = mesh;
    this._applyViewMode(id);
  }

  private _applyViewMode(id: string): void {
    const objs = this.partObjects.get(id);
    if (!objs) return;
    const showHitbox = this.viewMode !== 'present';
    const showPresent = this.viewMode !== 'hitbox';
    objs.hitboxMesh.visible  = showHitbox;
    objs.hitboxEdges.visible = showHitbox;
    if (objs.presentMesh) objs.presentMesh.visible = showPresent;
  }

  private _disposePartObjects(id: string): void {
    const objs = this.partObjects.get(id);
    if (!objs) return;
    this.spinGroup.remove(objs.hitboxMesh, objs.hitboxEdges);
    this.freeSpinGroup.remove(objs.hitboxMesh, objs.hitboxEdges);
    if (objs.presentMesh) {
      this.spinGroup.remove(objs.presentMesh);
      this.freeSpinGroup.remove(objs.presentMesh);
      this._disposeObj(objs.presentMesh);
    }
    this._disposeObj(objs.hitboxMesh);
    this._disposeObj(objs.hitboxEdges);
    this.partObjects.delete(id);
  }

  private _disposeObj(obj: THREE.Object3D): void {
    obj.traverse(child => {
      const c = child as THREE.Mesh;
      if (c.geometry) c.geometry.dispose();
      if (c.material) {
        const mats = Array.isArray(c.material) ? c.material : [c.material];
        mats.forEach(m => m.dispose());
      }
    });
  }
}
