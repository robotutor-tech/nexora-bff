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

export type RegisterDeviceResponse = {
  deviceId: string
  secret: string
  premisesId: string
  name: string
  zoneId: string
  registeredBy: string
  createdAt: Date
  updatedAt: Date
}

// export type RegisterDeviceResponse = { token: string; refreshToken: string }
export type DeviceFirmwareResponse = { version: string; url: string }
