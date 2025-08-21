import type { Route } from './+types/home';
import App from '../components/App.jsx';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Index() {
  return <App />;
}
