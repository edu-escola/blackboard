import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable, FormModal, useToastContext } from "@/components/shared";

// Example usage of the shared components
const ExamplePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showSuccess, showError } = useToastContext();

  // Example data for DataTable
  const sampleData = [
    { id: "1", name: "John Doe", email: "john@example.com", status: "Ativo", role: "Admin" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", status: "Inativo", role: "User" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", status: "Ativo", role: "User" }
  ];

  // DataTable columns configuration
  const columns = [
    { key: "name" as const, label: "Nome", sortable: true },
    { key: "email" as const, label: "Email", sortable: true },
    { 
      key: "status" as const, 
      label: "Status", 
      render: (value: string) => (
        <Badge className={value === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {value}
        </Badge>
      )
    },
    { key: "role" as const, label: "Cargo", sortable: true }
  ];

  // FormModal fields configuration
  const formFields = [
    { name: "name", label: "Nome completo", type: "text" as const, required: true },
    { name: "email", label: "Email", type: "email" as const, required: true },
    { 
      name: "role", 
      label: "Cargo", 
      type: "select" as const, 
      required: true,
      options: [
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" }
      ]
    },
    { name: "bio", label: "Biografia", type: "textarea" as const }
  ];

  const handleFormSubmit = async (data: Record<string, any>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    showSuccess("Usuário criado com sucesso!", `${data.name} foi adicionado ao sistema.`);
  };

  const handleBulkDelete = (selectedRows: any[]) => {
    showSuccess("Ação em massa concluída", `${selectedRows.length} itens deletados.`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Exemplo de componentes compartilhados</h1>
      
      {/* DataTable Example */}
      <DataTable
        data={sampleData}
        columns={columns}
        searchPlaceholder="Pesquisar usuários..."
        onRowClick={(row) => console.log("Row clicked:", row)}
        bulkActions={[
          { label: "Deletar selecionado", onClick: handleBulkDelete, variant: "destructive" }
        ]}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { value: "Active", label: "Ativo" },
              { value: "Inactive", label: "Inativo" }
            ]
          }
        ]}
      />

      {/* FormModal trigger */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Abrir formulário modal
      </button>

      {/* FormModal */}
      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Criar novo usuário"
        description="Preencha o formulário abaixo para criar uma nova conta de usuário."
        fields={formFields}
        onSubmit={handleFormSubmit}
        submitLabel="Criar usuário"
      />
    </div>
  );
};

export default ExamplePage;