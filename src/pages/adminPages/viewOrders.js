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

const ViewOrdersPage = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.userSlice.user);
    const dispatch = useDispatch();
    const [allOrders, setAllOrdersState] = useState([]);
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
        // window.scroll({
        //     top: 0,
        //     left: 0,
        //     behavior: "smooth",
        // });

        if (phone === "" || phone === false) {
            const phoneNull = null;
            axios
                .get(
                    `${REACT_APP_API_ENDPOINT}/admin/getOrders?phone=${phoneNull}&status=${status}`,
                    {
                        headers: {
                            "x-access-token": user.token,
                            "Content-Type": "application/json",
                        },
                    }
                )
                .then((response) => {
                    setAllOrdersState(response.data);
                })
                .catch((err) => {
                });
        }
        if (phone !== false && phone !== "") {
            const delayDebounceFn = setTimeout(() => {
                axios
                    .get(
                        `${REACT_APP_API_ENDPOINT}/admin/getOrders?phone=${String(phone)}&status=${status}`,
                        {
                            headers: {
                                "x-access-token": user.token,
                                "Content-Type": "application/json",
                            },
                        }
                    )
                    .then((response) => {
                        setAllOrdersState(response.data);
                    })
                    .catch((err) => {
                    });
            }, 1000);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [REACT_APP_API_ENDPOINT, phone, status, buttonColor]);



    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const handleChange = (event) => {
        console.log(event.target.value);
        setStatusSearch(event.target.value);
    };

    const handleClick = (orderId) => {

        axios
            .post(
                `${REACT_APP_API_ENDPOINT}/admin/changeStatus`,
                {
                    orderId: orderId
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
                            {['History', 'View Users', 'Messages'].map((text, index) => (
                                <ListItem key={text} disablePadding>
                                    {index === 0 &&
                                        <ListItemButton>
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
                                            <ListItemText primary={text} onClick={() => { navigate("/viewMessages") }}/>
                                        </ListItemButton>
                                    }
                                    {index === 2 &&
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <ForumIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={text} />
                                        </ListItemButton>
                                    }

                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid style={{ width: '80%', marginBottom: '3%', marginTop: '1%' }}>
                        <TextField id="SearchBrand" label="Search for orders by phone..." variant="standard" style={{ marginBottom: '5%', marginLeft: '5%', width: "30%" }}
                            value={phone ? phone : ""}
                            onChange={(e) => setPhoneSearch(e.target.value)}
                        />
                        <FormControl style={{ marginLeft: '3%' }}>
                            <FormLabel id="demo-row-radio-buttons-group-label">Status Filter:</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={status}
                                onChange={handleChange}
                            >
                                <FormControlLabel value="delivered" control={<Radio />} label="Delivered" />
                                <FormControlLabel value="purchase" control={<Radio />} label="Purchase" />
                                <FormControlLabel value="all" control={<Radio />} label="ALL" />
                            </RadioGroup>
                        </FormControl>
                        <Grid container style={{}}>
                            {allOrders && allOrders.map((order) => (

                                <Card sx={{ maxWidth: 345 }}
                                    style={{ marginLeft: '5%', marginBottom: '5%', width: "27%" }}
                                >
                                    <CardContent>
                                        {
                                            order && order.userId && order.userId.name &&
                                            <Typography gutterBottom variant="h5" component="div">
                                                {order?.userId?.name}
                                            </Typography>
                                        }
                                        {
                                            order && order.productId && order.productId.title &&
                                            <Typography gutterBottom variant="h5" component="div">
                                                {order?.productId?.title}
                                            </Typography>
                                        }
                                        {
                                            order && order.status &&
                                            <Typography gutterBottom sx={{ mb: 1.5 }} color="text.secondary">
                                                {order?.status}
                                            </Typography>
                                        }
                                        <Typography variant="body2" color="text.secondary">
                                            <p style={{ color: 'black' }}>Quantity:</p>
                                            {order.quantity && order?.quantity}/{order?.productId?.quantity}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <p style={{ color: 'black' }}>Date:</p>
                                            {order.createdAt && new Date(order.createdAt).toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                    {
                                        order && order.status && order.status == 'purchase' &&
                                        <CardActions>
                                            <Button style={{ color: 'red' }} onClick={() => { handleClick(order._id) }}>
                                                Deliver
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

export default ViewOrdersPage;
