export const CLASS_CATALOG = [
  { id: 'pessoa', label: 'Pessoa', key: '1', color: '#10B981', muiColor: 'success' },
  { id: 'celular', label: 'Celular', key: '2', color: '#8B5CF6', muiColor: 'secondary' },
  { id: 'caixa', label: 'Caixa Registradora', key: '3', color: '#3B82F6', muiColor: 'primary' },
  { id: 'dinheiro', label: 'Dinheiro', key: '4', color: '#F59E0B', muiColor: 'warning' },
  { id: 'gaveta', label: 'Gaveta', key: '5', color: '#F97316', muiColor: 'warning' },
  { id: 'produto', label: 'Produto', key: '6', color: '#06B6D4', muiColor: 'info' },
];

export const getClassDefinition = (classKeyOrLabel) => {
  if (!classKeyOrLabel) return CLASS_CATALOG[0];
  const query = String(classKeyOrLabel).toLowerCase().trim();
  return (
    CLASS_CATALOG.find(
      (c) => c.id === query || c.label.toLowerCase() === query || c.key === query
    ) || CLASS_CATALOG[0]
  );
};
