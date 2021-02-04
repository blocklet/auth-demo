import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import CircularProgress from '@material-ui/core/CircularProgress';

import Button from '@arcblock/ux/lib/Button';

import { useSessionContext } from '../libs/session';

export default function Main() {
  const { session, api } = useSessionContext();
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(null);

  useEffect(() => {
    getData();
  }, []); //eslint-disable-line

  const onPublish = () => {
    if (!content || loading) {
      return;
    }
    setLoading(true);
    api.post('/api/posts/create', { content }).then(res => {
      setLoading(false);
      getData();
      setContent('');
    }).catch(() => {
      setLoading(false);
    });
  }

  const getData = () => {
    api.get('/api/posts/list').then(res => {
      setPosts(res.data);
    }).catch(() => {
    });
  }

  const onDelete = (id) => {
    if (loading) {
      return;
    }
    setDeleteDialog(null)
    setLoading(true);
    api.post('/api/posts/remove', { id }).then(() => {
      getData()
      setLoading(false);
    }).catch((err) => {
      setLoading(false);
      alert(err.message)
    });
  }

  const isLogin = !!session.user;

  return (
    <Container>
      <Media className="header">
        <div className="left">
          <div style={{ fontSize: 20 }}>Auth Demo</div>
        </div>
        <div className="right">
          <Button onClick={() => isLogin ? session.logout() : session.login()}>{ isLogin ? 'Logout' : 'Login' }</Button>
        </div>
      </Media>
      <Media>
        <div className="left">
          <Avatar alt='' src={isLogin ? session.user.avatar : ''}></Avatar>
        </div>
        <div className="body">
          <TextField
            id="outlined-multiline-static"
            label="What's happening"
            multiline
            rows={4}
            value={content}
            onChange={e => setContent(e.target.value)}
            variant="outlined"
            disabled={!isLogin}
            fullWidth
            onKeyUp={e => {
              console.log(e.code)
              if(e.code === 'Enter' && e.ctrlKey) onPublish()
            }}
          />
          <div style={{textAlign: 'right', marginTop: 8}}>
            <Button rounded disabled={!isLogin || loading} variant="contained" color="primary" onClick={onPublish}>
              Publish
            </Button>
          </div>
        </div>
      </Media>
      <div>
        {posts.map(post => (
          <Media style={{padding: '14px 0'}}>
            <div className="left">
              <Avatar>{post.poster.fullName[0]}</Avatar>
            </div>
            <div className="body">
              <div>
                <span>{post.poster.fullName}</span>
              </div>
              <div style={{ minHeight: 20, whiteSpace: 'pre' }}>{post.content}</div>
            </div>
            <div className="right">
              { isLogin && session.user.role === 'admin' && (
                <IconButton color="secondary" aria-label="upload picture" component="span" onClick={() => {
                  setDeleteDialog({ id: post._id})
                }}>
                  <DeleteIcon />
                </IconButton>
              ) }
            </div>
          </Media>
        ))}
      </div>
      {!!deleteDialog && (
        <Dialog
          open
          onClose={() => { setDeleteDialog(null) }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Confirm Delete?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setDeleteDialog(null) }} color="primary">
              No
            </Button>
            <Button onClick={() => onDelete(deleteDialog.id)} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 10px;
  .header {
    padding: 20px 0;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
`;

const Media = styled.div`
  display: flex;
  justify-content: space-between;
  .left {
    flex-shrink: 0;
    margin-right: 10px;
  }
  .body {
    flex-grow: 1;
  }
  .right {
    flex-shrink: 0;
    margin-left: 10px;
  }
`;
