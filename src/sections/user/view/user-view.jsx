import axios from 'axios';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import {Alert, Snackbar} from "@mui/material";


import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
// import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('desc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('anchor_id');

  const [filterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [users, setUsers] = useState([]); // State to store users from API

  useEffect(() => {
    // Function to fetch data from API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/users');
        setUsers(response.data); // Update state with API data
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  // 弹窗
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 可以是 'success', 'error', 'warning', 'info'


  const [changes, setChanges] = useState({});

  // 提交按钮, 发送请求
  // const handleSubmit = async () => {
  //   try {
  //     const response = await axios.post('http://127.0.0.1:5000/api/update-multiple-statuses', {
  //       updates: Object.entries(changes).map(([id, newStatus]) => ({
  //         id,
  //         newStatus
  //       }))
  //     });
  //
  //     if (response.status === 200) {
  //       console.log('Status updates successful!');
  //       setChanges({});  // 清空更改记录
  //     } else {
  //       throw new Error('Failed to update statuses');
  //     }
  //   } catch (error) {
  //     console.error('Error updating statuses:', error);
  //   }
  // };

  const handleSubmit = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/api/update-multiple-statuses', {
      updates: Object.entries(changes).map(([id, newStatus]) => ({
        id,
        newStatus
      }))
    });

    if (response.status === 200) {
      console.log('Status updates successful!');
      setChanges({});  // 清空更改记录
      setSnackbarMessage('Status updates successful!');
      setSnackbarSeverity('success');
    } else {
      throw new Error('Failed to update statuses');
    }
  } catch (error) {
    console.error('Error updating statuses:', error);
    setSnackbarMessage('Failed to update statuses');
    setSnackbarSeverity('error');
  }
  setSnackbarOpen(true);
};


  // 控制变更状态
  const handleStatusChange = (anchor_id, newStatus) => {
    console.log("Changing status for:", anchor_id, "to", newStatus);  // 检查是否调用和参数
    setChanges(prev => ({...prev, [anchor_id]: newStatus}));  // 保留这个以便提交时使用

    // 更新 users 数组
    setUsers(prevUsers =>
        prevUsers.map(user =>
            user.anchor_id === anchor_id ? {...user, cstatus: newStatus} : user
        )
    );
  };


  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}  // 自动隐藏时间设置为2000毫秒（2秒）
          onClose={() => setSnackbarOpen(false)}  // 当Snackbar自动关闭时，也需要更新状态
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{width: '100%'}}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">数据列表</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleSubmit}>
          提交
        </Button>
      </Stack>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'anchor_id', label: 'id' },
                  { id: 'anchor_info', label: '主播信息' },
                  { id: 'upload_bid', label: 'B站ID' },
                  { id: 'cstatus', label: '录制状态'},
                  { id: 'type', label: '类型' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                      <UserTableRow
                        key={row.anchor_id}
                        id={row.id}
                        anchor_id={row.anchor_id}
                        selected={selected[row.id]}
                        anchor_info={row.anchor_info}
                        upload_bid={row.upload_bid}
                        cstatus={row.cstatus}
                        remarks={row.remarks}
                        type={row.type}
                        handleClick={() => handleClick(row.id)}
                        onStatusChange={handleStatusChange} // 传递状态更改处理函数
                      />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
