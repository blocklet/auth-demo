import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';

import DidAvatar from '@arcblock/did-connect/lib/Avatar';

import Button from '@arcblock/ux/lib/Button';
import Header from '@blocklet/ui-react/lib/Header';
import Footer from '@blocklet/ui-react/lib/Footer';

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
    api
      .post('/api/posts/create', { content })
      .then((res) => {
        setLoading(false);
        getData();
        setContent('');
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getData = () => {
    api
      .get('/api/posts/list')
      .then((res) => {
        setPosts(res.data);
      })
      .catch(() => {});
  };

  const onDelete = (id) => {
    if (loading) {
      return;
    }
    setDeleteDialog(null);
    setLoading(true);
    api
      .post('/api/posts/remove', { id })
      .then(() => {
        getData();
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        alert(err.message);
      });
  };

  const isLogin = !!session.user;

  return (
    <Box display="flex" flexDirection="column" height="100vh" overflow="hidden">
      <Header/>
      <Box flex="1" py={4} overflow="auto">
        <Container>
          <MainContainer>
            {!isLogin && (
              <div style={{ marginBottom: 20 }}>
                <Alert severity="info">Login to post message</Alert>
              </div>
            )}
            <Media>
              <div className="left">
                {isLogin ? <DidAvatar did={session.user.did}></DidAvatar> : <Avatar alt="" src=""></Avatar>}
              </div>
              <div className="body">
                <TextField
                  id="outlined-multiline-static"
                  label="What's happening"
                  multiline
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  variant="outlined"
                  disabled={!isLogin}
                  fullWidth
                  onKeyUp={(e) => {
                    console.log(e.code);
                    if (e.code === 'Enter' && e.ctrlKey) onPublish();
                  }}
                />
                <div style={{ textAlign: 'right', marginTop: 8 }}>
                  <Button rounded disabled={!isLogin || loading} variant="contained" color="primary" onClick={onPublish}>
                    Post
                  </Button>
                </div>
              </div>
            </Media>
            {isLogin && (
              <>
                <div style={{ margin: '10px 0' }}>
                  <Alert severity="info">Tip: admin role can delete post</Alert>
                </div>
                <div style={{ margin: '10px 0' }}>
                  <Alert severity="info">Tip: you can manage user role in ABT Node dashboard</Alert>
                </div>
              </>
            )}
            <div>
              {posts.map((post) => (
                <Media style={{ padding: '14px 0' }}>
                  <div className="left">
                    <DidAvatar did={post.poster.did} />
                  </div>
                  <div className="body">
                    <div>
                      <span>{post.poster.fullName}</span>
                      <span style={{ marginLeft: 10, color: '#888' }}>
                        {dayjs(post.createdAt).format('YYYY-MM-DD hh:mm:ss')}
                      </span>
                    </div>
                    <div style={{ minHeight: 20, whiteSpace: 'pre' }}>{post.content}</div>
                  </div>
                  <div className="right">
                    {isLogin && session.user.role === 'admin' && (
                      <IconButton
                        color="secondary"
                        aria-label="upload picture"
                        component="span"
                        onClick={() => {
                          setDeleteDialog({ id: post._id });
                        }}
                        size="large">
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </div>
                </Media>
              ))}
            </div>
            {!!deleteDialog && (
              <Dialog
                open
                onClose={() => {
                  setDeleteDialog(null);
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="sm"
                fullWidth>
                <DialogTitle id="alert-dialog-title"></DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">Confirm Delete?</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => {
                      setDeleteDialog(null);
                    }}
                    color="primary">
                    No
                  </Button>
                  <Button onClick={() => onDelete(deleteDialog.id)} color="primary" autoFocus>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </MainContainer>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}

const MainContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  .header {
    padding: 20px 0;
    display: flex;
    align-items: center;
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
