import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';

import DidAvatar from '@arcblock/did-connect/lib/Avatar';
import SessionManager from '@arcblock/did-connect/lib/SessionManager';
import Header from '@arcblock/ux/lib/Layout/header';
import Footer from '@arcblock/ux/lib/Layout/footer';

import Button from '@arcblock/ux/lib/Button';

import { useSessionContext } from '../libs/session';
import { getWebWalletUrl } from '../libs/util';

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
  const webWalletUrl = getWebWalletUrl();

  function genLinks(count, prefix = '') {
    return [...new Array(count)].map((_, i) => {
      const key = prefix ? `${prefix}-${i + 1}` : i + 1;
      return { title: `Title ${key}`, link: `/link-${key}` };
    });
  }
  
  const mockBlockletData = {
    appLogo: 'https://store.blocklet.dev/assets/z8iZpNnc48qcmdMYtvnHFQqroFikNG1AVTmfC/logo.png',
    navigation: genLinks(5),
    theme: {
      background: '#00FFFF',
    }
  }

  return (
    <Container>
      <Header {...mockBlockletData}></Header>
      <Media className="header">
        <div className="left">
          <div style={{ fontSize: 20 }}>Auth Demo</div>
        </div>
        <div className="right">
          <SessionManager session={session} webWalletUrl={webWalletUrl} showRole />
        </div>
      </Media>
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
                  }}>
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
      <Footer {...mockBlockletData}></Footer>
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
