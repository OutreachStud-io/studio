import {AlertCircleIcon} from "lucide-react";

import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/components/ui/alert";

type FormErrorsProps = {
	title?: string;
	description?: string;
	errors?: string[];
	className?: string;
	variant?: "default" | "destructive"
}

// General, form level errors that are not specific to a single field
export function FormErrors(p: FormErrorsProps) {
	return (
		<Alert variant={p.variant || "default"} className={p.className}>
			<AlertCircleIcon/>
			<AlertTitle>{p.title || "There was an error submitting the form"}</AlertTitle>
			<AlertDescription>
				<p>{p.description || "Please fix the following errors before continuing:"}</p>
				{p.errors && p.errors.length > 0 && (
					<ul className={"mt-2 list-disc list-inside"}>
						{p.errors.map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				)}
			</AlertDescription>
		</Alert>
	);
}
