import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SecurityIcon from '@mui/icons-material/Security';
import { useAuthStore } from '../infrastructure/stores/useAuthStore';

export default function Login() {
  const [email, setEmail] = useState('admin@olhovivo.ai');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0B0F17',
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.15), transparent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 420,
          width: '100%',
          bgcolor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1.5,
              }}
            >
              <SecurityIcon sx={{ color: '#38BDF8', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#F8FAFC', tracking: '-0.02em' }}>
              PROJETO OLHO VIVO
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.5 }}>
              Plataforma Enterprise de Visão Computacional
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#F87171' }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="E-mail Corporativo"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  color: '#FFFFFF',
                  bgcolor: 'rgba(30, 41, 59, 0.5)',
                  '& fieldset': { borderColor: '#334155' },
                  '&:hover fieldset': { borderColor: '#38BDF8' },
                },
                '& .MuiInputLabel-root': { color: '#94A3B8' },
              }}
            />

            <TextField
              fullWidth
              label="Senha de Acesso"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#94A3B8' }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3.5,
                '& .MuiOutlinedInput-root': {
                  color: '#FFFFFF',
                  bgcolor: 'rgba(30, 41, 59, 0.5)',
                  '& fieldset': { borderColor: '#334155' },
                  '&:hover fieldset': { borderColor: '#38BDF8' },
                },
                '& .MuiInputLabel-root': { color: '#94A3B8' },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                bgcolor: '#3B82F6',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                '&:hover': { bgcolor: '#2563EB' },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#FFFFFF' }} /> : 'Entrar no Sistema'}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Credenciais padrão: admin@olhovivo.ai / admin123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
