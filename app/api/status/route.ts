import { NextResponse } from 'next/server'

// This will proxy requests to the Colyseus server
export async function GET() {
  try {
    const gameServerUrl = process.env.COLYSEUS_SERVER_URL || 'http://localhost:2567'
    const response = await fetch(`${gameServerUrl}/api/health`)
    const data = await response.json()
    
    return NextResponse.json({
      admin: 'ok',
      gameServer: data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      admin: 'ok',
      gameServer: 'unavailable',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 503 })
  }
}
