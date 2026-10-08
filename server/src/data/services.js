const SERVICES = [
  {
    id: 'consultation',
    name: 'Consultation',
    summary: 'Talk through the problem and leave with a clear next step.',
    durationMinutes: 30,
  },
  {
    id: 'demo',
    name: 'Demo',
    summary: 'Watch the product in use and ask whatever is still unclear.',
    durationMinutes: 30,
  },
  {
    id: 'support',
    name: 'Support',
    summary: 'Bring one issue. We work through it in the same sitting.',
    durationMinutes: 30,
  },
];

function listServices() {
  return SERVICES.map((service) => ({ ...service }));
}

function getService(id) {
  return SERVICES.find((service) => service.id === id) || null;
}

module.exports = { listServices, getService };
