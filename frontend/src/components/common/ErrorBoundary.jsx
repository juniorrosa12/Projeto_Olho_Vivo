import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Olho Vivo Error Boundary capturou exceção:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: '#0B0F17',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            textAlign: 'center',
          }}
        >
          <WarningAmberIcon sx={{ fontSize: 64, color: '#EF4444', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#F8FAFC' }}>
            Ops! Algo deu errado no módulo.
          </Typography>
          <Typography variant="body1" sx={{ color: '#94A3B8', maxW: 600, mb: 3 }}>
            {this.state.error?.message || "Ocorreu uma falha de renderização no componente da interface."}
          </Typography>
          <Button
            variant="contained"
            onClick={this.handleReload}
            sx={{
              bgcolor: '#3B82F6',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              '&:hover': { bgcolor: '#2563EB' },
            }}
          >
            Recarregar Aplicação
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
