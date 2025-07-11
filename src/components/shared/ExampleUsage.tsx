import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable, FormModal, useToastContext } from "@/components/shared";

// Example usage of the shared components
const ExamplePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showSuccess, showError } = useToastContext();

  // Example data for DataTable
  const sampleData = [
    { id: "1", name: "John Doe", email: "john@example.com", status: "Active", role: "Admin" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", status: "Inactive", role: "User" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", status: "Active", role: "User" }
  ];

  // DataTable columns configuration
  const columns = [
    { key: "name" as const, label: "Name", sortable: true },
    { key: "email" as const, label: "Email", sortable: true },
    { 
      key: "status" as const, 
      label: "Status", 
      render: (value: string) => (
        <Badge className={value === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {value}
        </Badge>
      )
    },
    { key: "role" as const, label: "Role", sortable: true }
  ];

  // FormModal fields configuration
  const formFields = [
    { name: "name", label: "Full Name", type: "text" as const, required: true },
    { name: "email", label: "Email", type: "email" as const, required: true },
    { 
      name: "role", 
      label: "Role", 
      type: "select" as const, 
      required: true,
      options: [
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" }
      ]
    },
    { name: "bio", label: "Biography", type: "textarea" as const }
  ];

  const handleFormSubmit = async (data: Record<string, any>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    showSuccess("User created successfully!", `${data.name} has been added to the system.`);
  };

  const handleBulkDelete = (selectedRows: any[]) => {
    showSuccess("Bulk action completed", `${selectedRows.length} items deleted`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Shared Components Example</h1>
      
      {/* DataTable Example */}
      <DataTable
        data={sampleData}
        columns={columns}
        searchPlaceholder="Search users..."
        onRowClick={(row) => console.log("Row clicked:", row)}
        bulkActions={[
          { label: "Delete Selected", onClick: handleBulkDelete, variant: "destructive" }
        ]}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" }
            ]
          }
        ]}
      />

      {/* FormModal trigger */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Open Form Modal
      </button>

      {/* FormModal */}
      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Create New User"
        description="Fill in the form below to create a new user account."
        fields={formFields}
        onSubmit={handleFormSubmit}
        submitLabel="Create User"
      />
    </div>
  );
};

export default ExamplePage;