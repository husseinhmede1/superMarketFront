import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ForumIcon from '@mui/icons-material/Forum';
import { logout } from "../../reducers/userSlice.js";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
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
import Alert from '@mui/material/Alert';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel'
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

const ViewMessagesPage = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.userSlice.user);
    const dispatch = useDispatch();
    const [allMessages, setAllMessagesState] = useState([]);
    const [phone, setPhoneSearch] = useState("");
    const [status, setStatusSearch] = useState("all");
    const [buttonColor, setButtonColor] = useState(0);


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

        axios
            .get(
                `${REACT_APP_API_ENDPOINT}/admin/getMessages`,
                {
                    headers: {
                        "x-access-token": user.token,
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                setAllMessagesState(response.data);
            })
            .catch((err) => {
            });
    }, [REACT_APP_API_ENDPOINT, phone, status, buttonColor]);



    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const handleChange = (event) => {
        setStatusSearch(event.target.value);
    };

    const handleClick = (userId, productId) => {
        axios
            .post(
                `${REACT_APP_API_ENDPOINT}/admin/postInStock`,
                {
                    userId: userId,
                    productId: productId
                },
                {
                    headers: {
                        "x-access-token": user.token,
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                setButtonColor(buttonColor + 1);
            })
            .catch((err) => {
            });
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
                            {['History', 'View Users', 'Types'].map((text, index) => (
                                <ListItem key={text} disablePadding>
                                    {index === 0 &&
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <HistoryIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={text} onClick={() => { navigate("/viewOrders") }} />
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
                                            <ListItemText primary={text} onClick={() => { navigate("/dashboardAdmin") }} />
                                        </ListItemButton>
                                    }

                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid style={{ width: '80%', marginBottom: '3%', marginTop: '1%' }}>
                        <Grid container style={{}}>
                            {allMessages && allMessages.map((message) => (

                                <Card sx={{ maxWidth: 345 }}
                                    style={{ marginLeft: '5%', marginBottom: '5%', width: "27%" }}
                                >
                                    <CardContent>
                                        {
                                            message && message.userId && message.userId.name &&
                                            <Typography gutterBottom variant="p" component="div">
                                                User: {message?.userId?.name}
                                            </Typography>
                                        }
                                        {
                                            message && message.userId && message.userId.phone &&
                                            <Typography gutterBottom variant="p" component="div">
                                                Phone number: {message?.userId?.phone}
                                            </Typography>
                                        }
                                        {
                                            message && message.productId && message.productId.title &&
                                            <Typography gutterBottom variant="p" component="div">
                                                Product title: {message?.productId?.title}
                                            </Typography>
                                        }
                                        <Typography style={{ color: 'red' }} variant="body2" color="text.secondary">
                                            Quantity availble: {message?.productId?.quantity}
                                        </Typography>
                                        <Typography style={{ color: 'green' }} variant="body2" color="text.secondary">
                                            Date: {message.createdAt && new Date(message.createdAt).toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                    {
                                        message.isSent === "0" &&
                                        <CardActions>
                                            <Button variant="outlined" style={{ color: 'rgb(98, 13, 126)' }} onClick={() => { handleClick(message.userId._id, message.productId._id) }}>
                                                In Stock &nbsp;&nbsp; <WhatsAppIcon />
                                            </Button>
                                        </CardActions>
                                    }
                                </Card>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default ViewMessagesPage;
