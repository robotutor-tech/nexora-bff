export type DeviceInvitation = { token: string; name: string; invitationId: string; modelNo: string }
export type Device = {
  deviceId: string
  premisesId: string
  name: string
  modelNo: string
  serialNo: string
  type: 'DEVICE' | 'LOCAL_SERVER' | 'SERVER'
  state: 'ACTIVE' | 'INACTIVE'
  health: 'OFFLINE' | 'ONLINE'
  os?: { name: string; version: string }
}
