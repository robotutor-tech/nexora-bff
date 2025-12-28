export const apiConfig = {
  action: {
    baseUrl: process.env.AUTOMATION_SERVICE_BASE_URL ?? 'http://localhost:9001',
    actions: '/actions',
    action: '/actions/{actionId}'
  },
  actor: { baseUrl: process.env.IAM_SERVICE_BASE_URL ?? 'http://localhost:9001', me: '/actors/me' },
  iam: {
    baseUrl: process.env.AUTH_SERVICE_BASE_URL ?? 'http://localhost:9001',
    authenticate: '/iam/accounts/authenticate',
    accountRegister: '/iam/accounts/register',
    machineAccountRegister: '/iam/accounts/register/machine',
    premisesOwnerRegister: '/iam/premises-owners/register',
    credentialsRotate: '/iam/accounts/principal/{principalId}/credentials/rotate',
    deviceLogin: '/auth/login/device',
    authenticateActor: '/iam/actors/authenticate',
    actors: '/iam/actors',
    actor: '/iam/actors/me',
    machineActor: '/iam/actors/machine',
    validate: '/iam/sessions/validate',
    refresh: '/iam/sessions/refresh',
    deviceInvitation: '/auth/invitations'
  },
  automation: {
    baseUrl: process.env.AUTOMATION_SERVICE_BASE_URL ?? 'http://localhost:9001',
    automations: '/automations',
    automation: '/automations/{automationId}'
  },
  condition: {
    baseUrl: process.env.AUTOMATION_SERVICE_BASE_URL ?? 'http://localhost:9001',
    conditions: '/conditions',
    condition: '/conditions/{conditionId}'
  },
  device: {
    baseUrl: process.env.DEVICE_SERVICE_BASE_URL ?? 'http://localhost:9001',
    devices: '/devices',
    me: '/devices/me',
    commission: '/devices/commission',
    health: '/devices/health',
    deviceFirmware: '/devices/firmware'
  },
  entitlement: {
    baseUrl: process.env.AUTH_SERVICE_BASE_URL ?? 'http://localhost:9001',
    authorize: '/entitlements/authorize'
  },
  feed: {
    baseUrl: process.env.FEED_SERVICE_BASE_URL ?? 'http://localhost:9001',
    feeds: '/feeds',
    feedValue: '/feeds/{feedId}/value'
  },
  orchestration: {
    baseUrl: `${process.env.ORCHESTRATION_SERVICE_BASE_URL ?? 'http://localhost:9001'}`,
    users: '/orchestration/users/register',
    devices: '/orchestration/devices/register',
    deviceActor: '/orchestration/devices/actors/register',
    me: '/users/me',
    premises: '/orchestration/premises',
    premisesRegister: '/orchestration/premises/register'
  },
  premises: {
    baseUrl: process.env.PREMISES_SERVICE_BASE_URL ?? 'http://localhost:9001',
    premises: '/premises',
    premisesDetails: '/premises/{premisesId}'
  },
  rule: {
    baseUrl: process.env.AUTOMATION_SERVICE_BASE_URL ?? 'http://localhost:9001',
    rules: '/rules',
    rule: '/rules/{ruleId}'
  },
  user: {
    baseUrl: `${process.env.AUTH_SERVICE_BASE_URL ?? 'http://localhost:9001'}`,
    userRegister: '/users/register',
    me: '/users/me'
  },
  widget: { baseUrl: process.env.WIDGET_SERVICE_BASE_URL ?? 'http://localhost:9001', widgets: '/widgets' },
  zone: {
    baseUrl: process.env.ZONE_SERVICE_BASE_URL ?? 'http://localhost:9001',
    zones: '/zones'
  }
} as const
