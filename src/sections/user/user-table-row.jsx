import { useState } from 'react';
import PropTypes from 'prop-types';

// import Stack from '@mui/material/Stack';
// import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
// import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import {Select} from "@mui/material";

// ----------------------------------------------------------------------

export default function UserTableRow({
  id,
  anchor_id,
  selected,
  anchor_info,
  upload_bid,
  cstatus,
  remarks,
  type,
  handleClick,
    onStatusChange,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const [changes, setChanges] = useState({});

    // 当状态选择改变时
const handleSelectChange = (event) => {
    const newStatus = event.target.value;
    setChanges(prev => ({ ...prev, [anchor_id]: newStatus }));
    onStatusChange(anchor_id, newStatus);
};

  // 控制列表字段数据
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell align="center" sx={{ width: 50, minWidth: 80 }}>{anchor_id}</TableCell>


        <TableCell align="center" sx={{ width: 300, minWidth: 120, padding: 'normal' }}>
          {anchor_info}
        </TableCell>

        <TableCell align="center" sx={{ width: 250, minWidth: 150 }}>{upload_bid}</TableCell>

        <TableCell align="center" sx={{ width: 250, minWidth: 150 }}>
          <Select
            value={changes[id] || cstatus}
            onChange={handleSelectChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
               <MenuItem value={0}>跳过上传</MenuItem>
                <MenuItem value={1}>分片录制完成</MenuItem>
                <MenuItem value={2}>开始渲染</MenuItem>
                <MenuItem value={3}>渲染完成</MenuItem>
                <MenuItem value={4}>开始上传</MenuItem>
                <MenuItem value={5}>上传完成</MenuItem>
                <MenuItem value={6}>手动渲染成功</MenuItem>
                <MenuItem value={7}>手动上传成功</MenuItem>
                <MenuItem value={-2}>渲染错误</MenuItem>
                <MenuItem value={-3}>重新上传</MenuItem>
                <MenuItem value={-4}>上传错误</MenuItem>
                <MenuItem value={-6}>手动渲染失败</MenuItem>
                <MenuItem value={-7}>手动上传失败</MenuItem>
          </Select>
      </TableCell>

        <TableCell align="center" sx={{ width: 150, minWidth: 150 }}>{type}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  id: PropTypes.number.isRequired,
  anchor_id: PropTypes.number,
  anchor_info: PropTypes.string, // 或 PropTypes.any 根据实际数据类型决定
  upload_bid: PropTypes.string,  // 明确类型为字符串
  cstatus: PropTypes.string,     // 明确类型为字符串
  remarks: PropTypes.string,     // 明确类型为字符串
  type: PropTypes.string,        // 明确类型为字符串
  selected: PropTypes.any,
  handleClick: PropTypes.func,   // 如果你的行有点击事件
  onStatusChange: PropTypes.func,   // 如果你的行有点击事件
};
