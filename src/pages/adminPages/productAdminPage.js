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

const ProductAdminPage = () => {
    const { typeName } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.userSlice.user);
    const dispatch = useDispatch();
    const [allProducts, setAllProductsState] = useState([]);
    const [productSearch, setProductSearch] = useState("");
    const [value1, setValue1] = React.useState([0, 100]);
    const [flag, setFlag] = useState(0);


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

        if (productSearch === "" || productSearch === false) {
            axios
                .get(
                    `${REACT_APP_API_ENDPOINT}/admin/getProductByType?typeName=${typeName}&brand=null&minRange=${String(value1[0])}&maxRange=${String(value1[1])}`,
                    {
                        headers: {
                            "x-access-token": user.token,
                            "Content-Type": "application/json",
                        },
                    }
                )
                .then((response) => {
                    setAllProductsState(response.data);
                })
                .catch((err) => {
                });
        }
        if (productSearch !== false && productSearch !== "") {
            const delayDebounceFn = setTimeout(() => {
                axios
                    .get(
                        `${REACT_APP_API_ENDPOINT}/admin/getProductByType?typeName=${typeName}&brand=${productSearch}&minRange=${String(value1[0])}&maxRange=${String(value1[1])}`,
                        {
                            headers: {
                                "x-access-token": user.token,
                                "Content-Type": "application/json",
                            },
                        }
                    )
                    .then((response) => {
                        setAllProductsState(response.data);
                    })
                    .catch((err) => {
                    });
            }, 1000);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [REACT_APP_API_ENDPOINT, productSearch, value1, flag]);


    const handleChange1 = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
        } else {
            setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const deleteProduct = (productId) => {
        axios
            .get(
                `${REACT_APP_API_ENDPOINT}/admin/deleteProduct?productId=${productId}`,
                {
                    headers: {
                        "x-access-token": user.token,
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                setFlag(Flag + 1);
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
                        <TextField id="SearchBrand" label="Search for a brand..." variant="standard" style={{ marginLeft: '5%', width: "30%" }}
                            value={productSearch ? productSearch : ""}
                            onChange={(e) => setProductSearch(e.target.value)}
                        />
                        <div className='onSameLine'>

                            <Box
                                style={{ marginLeft: '5%', marginTop: '4%', marginBottom: '3%', width: "30%" }}
                            >

                                <Typography style={{ marginBottom: '1%', color: 'gray' }}>
                                    Price:
                                </Typography>
                                <Slider
                                    getAriaLabel={() => 'Minimum distance'}
                                    value={value1}
                                    onChange={handleChange1}
                                    valueLabelDisplay="auto"
                                    getAriaValueText={valuetext}
                                    disableSwap
                                />
                            </Box>
                            <Button variant="contained" onClick={() => { navigate(`/adminAddProduct/${typeName}`) }}>ADD product</Button>
                        </div>
                        <Grid container style={{}}>
                            {allProducts && allProducts.map((product) => (

                                <Card sx={{ maxWidth: 345 }}
                                    style={{ marginLeft: '5%', marginBottom: '5%', width: "27%" }}
                                >
                                    {product.img && <CardMedia
                                        sx={{ height: 140 }}
                                        image={product.img}
                                        title="green iguana"
                                    />
                                    }                                    <CardContent>
                                        {
                                            product && product.title &&
                                            <Typography gutterBottom variant="h5" component="div">
                                                {product?.title}
                                            </Typography>
                                        }
                                        <div className='onSameLine'>

                                            <Typography variant="body2" color="text.secondary">
                                                <p style={{ color: 'black' }}>Brand:</p>
                                                {product?.brand}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <p style={{ color: 'black' }}>quantity:</p>
                                                {product?.quantity}
                                            </Typography>

                                        </div>

                                        <div className='onSameLine'>
                                            <Typography variant="body2" color="text.secondary">
                                                <p style={{ color: 'black' }}>price:</p>
                                                {product?.price}$
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <p style={{ color: 'black' }}>discount:</p>
                                                {product?.discount}%
                                            </Typography>
                                        </div>
                                        <Typography variant="body2" color="text.secondary">
                                            <p style={{ color: 'black' }}>description:</p>
                                            {product?.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button variant="outlined" style={{ color: 'green', borderColor: 'green' }} onClick={() => { navigate(`/adminEditProduct/${typeName}/${product._id}/${product.title}`) }}>edit</Button>
                                        <Button variant="outlined" style={{ color: 'red', borderColor: 'red' }} onClick={() => { deleteProduct(product?._id) }}>delete</Button>
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

export default ProductAdminPage;
