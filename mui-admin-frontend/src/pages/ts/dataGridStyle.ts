
export const dataGridCommonProps = {
  rowHeight: 45,
  columnHeaderHeight: 50,
  sx: {
    border: '1px solid black',
    '& .MuiDataGrid-columnHeader': {
      borderRight: '1px solid black',
      borderBottom: '1px solid black',
      backgroundColor: '#c5c8c2',
      color: '#black',
      fontWeight: '700' ,
      fontSize:'18px',
    },
    '& .MuiDataGrid-cell': {
      borderRight: '1px solid black',
      borderBottom: '1px solid black',
    },
    '& .MuiDataGrid-sortIcon': {
      color: '#ffffff',
    },
  },
};