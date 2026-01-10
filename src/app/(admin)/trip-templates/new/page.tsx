import { initializeDataSource } from "@/lib/typeorm";
import { Province } from "@/entities/Province";
import TripTemplateForm from "../_components/TripTemplateForm";

export const dynamic = "force-dynamic";

export default async function NewTripTemplatePage() {
    const dataSource = await initializeDataSource();
    const provinceRepo = dataSource.getRepository<Province>("Province");
    const provinces = await provinceRepo.find({
        order: { name: "ASC" }
    });

    return (
        <TripTemplateForm
            provinces={provinces.map(p => ({ id: p.id, name: p.name }))}
        />
    );
}
