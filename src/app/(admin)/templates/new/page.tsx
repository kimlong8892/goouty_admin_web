import TemplateForm from "../_components/TemplateForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Template",
};

export default function NewTemplatePage() {
    return <TemplateForm />;
}
