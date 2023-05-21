import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ForumIcon from '@mui/icons-material/Forum';
import { logout } from "../../reducers/userSlice.js";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import GroupIcon from '@mui/icons-material/Group';
import Typography from '@mui/material/Typography';
import HistoryIcon from '@mui/icons-material/History';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import axios from "axios";
import { Flag, Label } from '@mui/icons-material';
import "./admin.css";
const { REACT_APP_API_ENDPOINT } = process.env;

function valuetext(value) {
    return `${value}°$`;
}

const minDistance = 0;

const ViewUsersPage = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.userSlice.user);
    const dispatch = useDispatch();
    const [allUsers, setAllUsersState] = useState([]);
    const [phone, setPhoneSearch] = useState("");


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

        if (phone === "" || phone === false) {
            const phoneNull = null;
            axios
                .get(
                    `${REACT_APP_API_ENDPOINT}/admin/getUsersByPhone?phone=${phoneNull}`,
                    {
                        headers: {
                            "x-access-token": user.token,
                            "Content-Type": "application/json",
                        },
                    }
                )
                .then((response) => {
                    setAllUsersState(response.data);
                })
                .catch((err) => {
                });
        }
        if (phone !== false && phone !== "") {
            const delayDebounceFn = setTimeout(() => {
                axios
                    .get(
                        `${REACT_APP_API_ENDPOINT}/admin/getUsersByPhone?phone=${String(phone)}`,
                        {
                            headers: {
                                "x-access-token": user.token,
                                "Content-Type": "application/json",
                            },
                        }
                    )
                    .then((response) => {
                        setAllUsersState(response.data);
                    })
                    .catch((err) => {
                    });
            }, 1000);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [REACT_APP_API_ENDPOINT, phone]);



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
                                        <ListItemButton>
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
                                            <ListItemText primary={text} onClick={() => { navigate("/viewMessages") }}/>
                                        </ListItemButton>
                                    }

                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid style={{ width: '80%' }}>
                        <TextField id="SearchBrand" label="Search for a user by phone..." variant="standard" style={{ marginBottom: '5%', marginLeft: '5%', width: "30%" }}
                            value={phone ? phone : ""}
                            onChange={(e) => setPhoneSearch(e.target.value)}
                        />
                        <Grid container style={{}}>
                            {allUsers && allUsers.map((user) => (

                                <Card sx={{ maxWidth: 345 }}
                                    style={{ marginLeft: '5%', marginBottom: '5%', width: "27%" }}
                                >
                                    <CardMedia
                                        sx={{ height: 140 }}
                                        image=""
                                        title="green iguana"
                                    />
                                    <CardContent>
                                        {
                                            user && user.name &&
                                            <Typography gutterBottom variant="h5" component="div">
                                                {user?.name}
                                            </Typography>
                                        }
                                        <Typography variant="body2" color="text.secondary">
                                            <p style={{ color: 'black' }}>Brand:</p>
                                            {user?.email}
                                        </Typography>
                                        <div className='onSameLine'>
                                            <Typography variant="body2" color="text.secondary">
                                                {user?.phone}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {user?.address1}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {user?.address2}
                                            </Typography>
                                        </div>
                                    </CardContent>
                                    <CardActions>
                                        <Button variant="outlined" style={{ color: 'green', borderColor: 'green' }}>edit</Button>
                                        <Button variant="outlined" style={{ color: 'red', borderColor: 'red' }}>delete</Button>
                                    </CardActions>
                                </Card>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default ViewUsersPage;
