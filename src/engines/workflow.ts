export type LifecycleStep = { id: string; title: string; done: boolean };

export const JOINER_FLOW: LifecycleStep[] = [
  { id: 'offer', title: 'Offer accepted', done: true },
  { id: 'create', title: 'Create employee', done: false },
  { id: 'docs', title: 'Request documents', done: false },
  { id: 'bgv', title: 'Background verification', done: false },
  { id: 'it', title: 'Create IT request', done: false },
  { id: 'kit', title: 'Assign equipment', done: false },
  { id: 'accounts', title: 'Create accounts', done: false },
  { id: 'manager', title: 'Assign manager', done: false },
  { id: 'tasks', title: 'Onboarding tasks', done: false },
  { id: 'orientation', title: 'Schedule orientation', done: false },
  { id: 'probation', title: 'Start probation', done: false },
];

export const EXIT_FLOW: LifecycleStep[] = [
  { id: 'resign', title: 'Resignation', done: false },
  { id: 'notice', title: 'Notice period', done: false },
  { id: 'mgr', title: 'Manager approval', done: false },
  { id: 'hr', title: 'HR processing', done: false },
  { id: 'assets', title: 'Asset recovery', done: false },
  { id: 'access', title: 'Access revocation', done: false },
  { id: 'fnf', title: 'Payroll settlement', done: false },
  { id: 'interview', title: 'Exit interview', done: false },
  { id: 'survey', title: 'Experience survey', done: false },
  { id: 'alumni', title: 'Alumni', done: false },
];
