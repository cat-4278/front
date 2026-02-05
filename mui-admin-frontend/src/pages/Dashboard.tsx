import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
} from '@mui/material';
import {
  ShoppingCart,
  Inventory,
  AttachMoney,
  TrendingUp,
} from '@mui/icons-material';
import { productApi, Product } from '@/api/product';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: color,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalStock: 0,
    totalValue: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const result = await productApi.getList(0, 1000);
      const products = result.data;

      setStats({
        totalProducts: products.length,
        activeProducts: products.filter((p) => p.isActive).length,
        totalStock: products.reduce((sum, p) => sum + p.stock, 0),
        totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
      });
    } catch (error) {
      console.error('통계 로딩 실패:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        대시보드
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 제품 수"
            value={stats.totalProducts}
            icon={<ShoppingCart sx={{ color: 'white', fontSize: 40 }} />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="활성 제품"
            value={stats.activeProducts}
            icon={<TrendingUp sx={{ color: 'white', fontSize: 40 }} />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 재고"
            value={stats.totalStock.toLocaleString()}
            icon={<Inventory sx={{ color: 'white', fontSize: 40 }} />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="재고 가치"
            value={`₩${stats.totalValue.toLocaleString()}`}
            icon={<AttachMoney sx={{ color: 'white', fontSize: 40 }} />}
            color="warning.main"
          />
        </Grid>
      </Grid>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          환영합니다!
        </Typography>
        <Typography variant="body1" paragraph>
          Material UI 기반 탭형 SPA Admin 시스템입니다.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          좌측 메뉴에서 제품 관리를 선택하여 시작하세요.
        </Typography>
      </Paper>
    </Box>
  );
}
