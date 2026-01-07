import { CompanyMembership } from "@/types/company";
import { setActiveCompany } from "@/lib/activeCompanyStorage";

interface CompanySelectorProps {
  memberships: CompanyMembership[];
  onChange?: (companyId: string) => void;
}

export function CompanySelector({ memberships, onChange }: CompanySelectorProps) {
  const activeMemberships = memberships.filter((m) => m.status === "ACTIVE");

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const companyId = e.target.value;
    const membership = activeMemberships.find((m) => m.company.id === companyId);

    if (!membership) return;

    setActiveCompany({
      id: membership.company.id,
      name: membership.company.name,
    });

    onChange?.(membership.company.id);
  }

  return (
    <select onChange={handleSelect} defaultValue="">
      <option value="" disabled>
        Seleccioná una empresa
      </option>

      {activeMemberships.map((m) => (
        <option key={m.company.id} value={m.company.id}>
          {m.company.name}
        </option>
      ))}
    </select>
  );
}
