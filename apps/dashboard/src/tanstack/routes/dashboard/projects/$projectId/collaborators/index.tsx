import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute(
	'/dashboard/projects/$projectId/collaborators/',
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/dashboard/projects/$projectId/collaborators/"!</div>;
}
