import { useCompany } from "@/contexts/companyContext";

export function CompanySelector() {
  const { companies, activeCompany, setActiveCompany, loading } = useCompany();

  if (loading) return null;
  if (!Array.isArray(companies)) return null;

  const validCompanies = companies.filter((c) => c?.id);

  if (validCompanies.length <= 1) return null;

  return (
    <select
      value={activeCompany?.id ?? ""}
      onChange={(e) => {
        const company = validCompanies.find((c) => c.id === e.target.value);
        if (company) setActiveCompany(company);
      }}
      className="border rounded px-2 py-1 text-sm"
    >
      <option value="" disabled>
        Seleccionar empresa
      </option>

      {validCompanies.map((company) => (
        <option key={company.id} value={company.id}>
          {company.name}
        </option>
      ))}
    </select>
  );
}
