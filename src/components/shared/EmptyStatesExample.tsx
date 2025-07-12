import { EmptyStates, LoadingState, ErrorState } from "@/components/shared/EmptyStates";
import { DataTable } from "@/components/shared/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

// Example component showing how to use empty states
const EmptyStatesExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const handleAddStudent = () => {
    console.log("Add student clicked");
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  // Example of DataTable with empty state
  const StudentsTable = () => {
    const columns = [
      { key: "name" as const, label: "Nome" },
      { key: "email" as const, label: "Email" },
      { key: "class" as const, label: "Classe" }
    ];

    if (isLoading) {
      return <LoadingState message="Carregando alunos..." />;
    }

    if (hasError) {
      return <ErrorState onRetry={handleRetry} />;
    }

    if (data.length === 0) {
      return (
        <EmptyStates.NoStudents 
          action={{
            label: "Adicionar primeiro aluno",
            onClick: handleAddStudent
          }}
        />
      );
    }

    return (
      <DataTable
        data={data}
        columns={columns}
      />
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Exemplos de estados vazios</h1>

      {/* Students Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentsTable />
        </CardContent>
      </Card>

      {/* Control Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => setIsLoading(!isLoading)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Alternar Carregamento
        </button>
        <button
          onClick={() => setHasError(!hasError)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Alternar Erro
        </button>
        <button
          onClick={() => setData(data.length === 0 ? [
            { id: "1", name: "John Doe", email: "john@example.com", class: "Math 101" }
          ] : [])}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Alternar Dados
        </button>
      </div>

      {/* Individual Empty State Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sem Professores</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyStates.NoProfessors />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
              <CardTitle>Sem Turmas</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyStates.NoClasses 
              action={{
                label: "Criar Turma",
                onClick: () => console.log("Create class")
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nenhum Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            {EmptyStates.NoSearchResults("advanced mathematics")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sem Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyStates.NoEvents />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmptyStatesExample;