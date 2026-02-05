import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { productApi, Product } from '@/api/product';
import { useAuth } from '@/contexts/AuthContext';
import { dataGridCommonProps } from './ts/dataGridStyle';


export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await productApi.getList(0, 1000);
      setProducts(result.data);
    } catch (error) {
      showSnackbar('제품 목록 로딩 실패', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (currentProduct.id) {
        await productApi.update(currentProduct.id, currentProduct);
        showSnackbar('수정되었습니다');
      } else {
        await productApi.create(currentProduct);
        showSnackbar('생성되었습니다');
      }
      setDialogOpen(false);
      loadProducts();
    } catch (error) {
      showSnackbar('저장 실패', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await productApi.delete(id);
      showSnackbar('삭제되었습니다');
      loadProducts();
    } catch (error) {
      showSnackbar('삭제 실패', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const openDialog = (product?: Product) => {
    setCurrentProduct(product || { isActive: true, stock: 0, price: 0 });
    setDialogOpen(true);
  };

  const openViewDialog = (product: Product) => {
    setCurrentProduct(product);
    setViewDialogOpen(true);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: '제품명', flex: 1, minWidth: 150 },
    {
      field: 'category',
      headerName: '카테고리',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip label={params.value} color="primary" size="small" />
      ),
    },
    {
      field: 'price',
      headerName: '가격',
      width: 120,
      renderCell: (params: GridRenderCellParams) => `₩${params.value.toLocaleString()}`,
    },
    { field: 'stock', headerName: '재고', width: 90 },
    {
      field: 'isActive',
      headerName: '상태',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? '활성' : '비활성'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: '작업',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton size="small" onClick={() => openViewDialog(params.row)}>
            <Visibility fontSize="small" />
          </IconButton>
          {isAdmin && (
            <>
              <IconButton size="small" onClick={() => openDialog(params.row)}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(params.row.id)}>
                <Delete fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 200px)' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>제품 관리</h2>
        {isAdmin && (
          <Button variant="contained" startIcon={<Add />} onClick={() => openDialog()}>
            새 제품
          </Button>
        )}
      </Box>

      <DataGrid
        {...dataGridCommonProps}
        rows={products}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        disableRowSelectionOnClick
        
       
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{currentProduct.id ? '제품 수정' : '새 제품'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="제품명"
            value={currentProduct.name || ''}
            onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="설명"
            value={currentProduct.description || ''}
            onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="가격"
            type="number"
            value={currentProduct.price || 0}
            onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="재고"
            type="number"
            value={currentProduct.stock || 0}
            onChange={(e) => setCurrentProduct({ ...currentProduct, stock: Number(e.target.value) })}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>카테고리</InputLabel>
            <Select
              value={currentProduct.category || ''}
              onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
              label="카테고리"
            >
              <MenuItem value="전자제품">전자제품</MenuItem>
              <MenuItem value="액세서리">액세서리</MenuItem>
              <MenuItem value="오디오">오디오</MenuItem>
              <MenuItem value="모니터">모니터</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="이미지 URL"
            value={currentProduct.imageUrl || ''}
            onChange={(e) => setCurrentProduct({ ...currentProduct, imageUrl: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>취소</Button>
          <Button onClick={handleSave} variant="contained">
            저장
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>제품 상세</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField fullWidth label="ID" value={currentProduct.id || ''} margin="normal" disabled />
            <TextField fullWidth label="제품명" value={currentProduct.name || ''} margin="normal" disabled />
            <TextField fullWidth label="설명" value={currentProduct.description || ''} margin="normal" disabled multiline rows={3} />
            <TextField fullWidth label="가격" value={`₩${(currentProduct.price || 0).toLocaleString()}`} margin="normal" disabled />
            <TextField fullWidth label="재고" value={currentProduct.stock || 0} margin="normal" disabled />
            <TextField fullWidth label="카테고리" value={currentProduct.category || ''} margin="normal" disabled />
            <TextField fullWidth label="상태" value={currentProduct.isActive ? '활성' : '비활성'} margin="normal" disabled />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
