export type Feed = {
  feedId: string
  deviceId: string
  premisesId: string
  type: 'ACTUATOR' | 'SENSOR'
  value: number
  range: { mode: 'DIGITAL' | 'ANALOG'; min: number; max: number }
  createdAt: Date
  updatedAt: Date
  // optional for now, not implemented in backend yet
  resumeOnRestart?: boolean
  updateLocally?: boolean
}
