export const apiConfig = {
  action: {
    baseUrl: process.env.AUTOMATION_SERVICE_BASE_URL ?? 'http://localhost:9001',
    actions: '/actions',
    action: '/actions/{actionId}'
  },
  actor: { baseUrl: process.env.IAM_SERVICE_BASE_URL ?? 'http://localhost:9001', me: '/actors/me' },
  auth: {
    baseUrl: process.env.AUTH_SERVICE_BASE_URL ?? 'http://localhost:9001',
    login: '/auth/login',
    actorLogin: '/auth/login/actor',
    validate: '/auth/validate',
    refresh: '/auth/refresh',
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
  device: { baseUrl: process.env.DEVICE_SERVICE_BASE_URL ?? 'http://localhost:9001/devices' },
  feed: { baseUrl: process.env.FEED_SERVICE_BASE_URL ?? 'http://localhost:9001/feeds', feedValue: '/{feedId}/value' },
  premises: {
    baseUrl: process.env.PREMISES_SERVICE_BASE_URL ?? 'http://localhost:9001',
    premises: '/premises',
    premisesDetails: '/premises/{premisesId}'
  },
  orchestration: {
    baseUrl: `${process.env.AUTH_SERVICE_BASE_URL ?? 'http://localhost:9001'}/orchestration`,
    registerUser: '/users/register',
    registerPremises: '/premises/register',
    registerDevice: '/devices/register',
    getPremises: '/premises'
  },
  trigger: {
    baseUrl: process.env.AUTOMATION_SERVICE_BASE_URL ?? 'http://localhost:9001',
    triggers: '/triggers',
    trigger: '/triggers/{triggerId}'
  },
  user: {
    baseUrl: `${process.env.AUTH_SERVICE_BASE_URL ?? 'http://localhost:9001'}/users`,
    me: '/me'
  },
  widget: { baseUrl: process.env.WIDGET_SERVICE_BASE_URL ?? 'http://localhost:9001/widgets' },
  zone: {
    baseUrl: process.env.ZONE_SERVICE_BASE_URL ?? 'http://localhost:9001/zones'
  }
} as const
