export const ApiConfig = {
  baseUrl: process.env.BACKEND_BASE_URL ?? 'http://localhost:9001',
  action: {
    actions: '/actions',
    action: '/actions/{actionId}'
  },
  actor: { me: '/actors/me' },
  identity: {
    account: {
      user: {
        authenticate: '/identity/accounts/users/authenticate',
        register: '/identity/accounts/users/register'
      }
    },
    authenticate: '/identity/accounts/authenticate',
    machineAccountRegister: '/identity/accounts/register/machine',
    premisesOwnerRegister: '/identity/premises-owners/register',
    credentialsRotate: '/identity/accounts/principal/{principalId}/credentials/rotate',
    deviceLogin: '/auth/login/device',
    authenticateActor: '/identity/actors/authenticate',
    actors: '/identity/actors',
    actor: '/identity/actors/me',
    authorize: '/identity/resources/authorize',
    machineActor: '/identity/actors/machine',
    validate: '/identity/sessions/validate',
    refresh: '/identity/sessions/refresh',
    deviceInvitation: '/auth/invitations'
  },
  automation: {
    automations: '/automations',
    automation: '/automations/{automationId}'
  },
  condition: {
    conditions: '/conditions',
    condition: '/conditions/{conditionId}'
  },
  device: {
    devices: '/devices',
    me: '/devices/me',
    commission: '/devices/commission',
    health: '/devices/health',
    deviceFirmware: '/devices/firmware'
  },
  entitlement: { authorize: '/entitlements/authorize' },
  feed: { feeds: '/feeds', feedValue: '/feeds/{feedId}/value' },
  orchestration: {
    users: '/orchestration/users/register',
    devices: '/orchestration/devices/register',
    deviceActor: '/orchestration/devices/actors/register',
    me: '/users/me',
    premises: '/orchestration/premises',
    premisesRegister: '/orchestration/premises/register'
  },
  premises: { premises: '/premises', premisesDetails: '/premises/{premisesId}' },
  rule: { rules: '/rules', rule: '/rules/{ruleId}' },
  user: { userRegister: '/users/register', me: '/users/me' },
  widget: { widgets: '/widgets' },
  zone: { zones: '/zones' }
} as const

export const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000'
