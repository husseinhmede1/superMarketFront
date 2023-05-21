import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar'
import ForumIcon from '@mui/icons-material/Forum';
import { logout } from "../../reducers/userSlice.js";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import GroupIcon from '@mui/icons-material/Group';
import Typography from '@mui/material/Typography';
import HistoryIcon from '@mui/icons-material/History';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import axios from "axios";
const { REACT_APP_API_ENDPOINT } = process.env;

const DashboardAdminPage = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.userSlice.user);
    const dispatch = useDispatch();
    const [allTypes, setAllTypesState] = useState([]);
    const [typeSearch, setTypeSearch] = useState(false);

    useEffect(() => {
        if (!user && user.role != "admin") {
            dispatch(logout());
            navigate("/");
            return;
        }
    }, [])

    useEffect(() => {
        window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
        if (typeSearch === "" || typeSearch === false) {
            axios
                .get(
                    `${REACT_APP_API_ENDPOINT}/admin/getAllTypes?typeSearch=null`,
                    {
                        headers: {
                            "x-access-token": user.token,
                            "Content-Type": "application/json",
                        },
                    }
                )
                .then((response) => {
                    setAllTypesState(response.data);
                })
                .catch((err) => {
                });
        }
        if (typeSearch !== false && typeSearch !== "") {
            const delayDebounceFn = setTimeout(() => {
                axios
                    .get(
                        `${REACT_APP_API_ENDPOINT}/admin/getAllTypes?typeSearch=${typeSearch}`,
                        {
                            headers: {
                                "x-access-token": user.token,
                                "Content-Type": "application/json",
                            },
                        }
                    )
                    .then((response) => {
                        setAllTypesState(response.data);
                    });
            }, 1000);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [REACT_APP_API_ENDPOINT, typeSearch]);


    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                        </IconButton>
                        {
                            user &&
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                {user.name}
                            </Typography>
                        }
                        <Button onClick={() => { handleLogout() }} color="inherit">Log Out</Button>
                    </Toolbar>
                </AppBar>
                <Grid container>
                    <Grid>
                        <List>
                            {['History', 'View Users', 'Messages'].map((text, index) => (
                                <ListItem key={text} disablePadding>
                                    {index === 0 &&
                                        <ListItemButton onClick={() => { navigate("/viewOrders") }}>
                                            <ListItemIcon>
                                                <HistoryIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={text} />
                                        </ListItemButton>
                                    }
                                    {index === 1 &&
                                        <ListItemButton onClick={() => { navigate("/viewUsers") }}>
                                            <ListItemIcon>
                                                <GroupIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={text} />
                                        </ListItemButton>
                                    }
                                    {index === 2 &&
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <ForumIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={text} onClick={() => { navigate("/viewMessages") }} />
                                        </ListItemButton>
                                    }

                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid style={{ width: '80%' }}>
                        <TextField id="SearchType" label="Search for a type..." variant="standard" style={{ marginLeft: '5%', width: "30%" }}
                            value={typeSearch ? typeSearch : ""}
                            onChange={(e) => setTypeSearch(e.target.value)}
                        />
                        <ImageList sx={{ width: '100%', height: '100%', padding: '5%' }} style={{ overflow: 'hidden' }}>
                            {allTypes && allTypes.map((type) => (
                                <ImageListItem key={type.image} onClick={() => { navigate(`/productAdmin/${type.typeName}`) }}>
                                    <iframe src={`${type.image}`} width="100%" height="100%" style={{ border: '2px solid blue', borderColor: 'blue', borderRadius: '15px' }}></iframe>
                                    <ImageListItemBar
                                        title={type.typeName}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default DashboardAdminPage;
