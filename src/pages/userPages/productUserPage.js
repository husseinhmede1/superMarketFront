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
import EmergencyShareIcon from '@mui/icons-material/EmergencyShare';
import HistoryIcon from '@mui/icons-material/History';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import SnackbarContent from '@mui/material/SnackbarContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import { addToCard } from "../../reducers/userSlice.js";
import { deleteCard } from "../../reducers/userSlice.js";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';
import axios from "axios";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import "./user.css";
const { REACT_APP_API_ENDPOINT } = process.env;

function valuetext(value) {
    return `${value}°$`;
}

const minDistance = 0;

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));

const ProductUserPage = () => {
    const { typeName } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.userSlice.user);
    const dispatch = useDispatch();
    const [allProducts, setAllProductsState] = useState([]);
    const [productSearch, setProductSearch] = useState("");
    const [value1, setValue1] = React.useState([0, 100]);
    const [flag, setFlag] = useState(0);
    const [cardLength, setCardLength] = useState(0);
    const [cardContent, setCardContent] = useState();
    const [open, setOpen] = React.useState(false);
    const [alert, setAlert] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        if (!user && user.role != "user") {
            dispatch(logout());
            navigate("/");
            return;
        }
        if (user.card) {
            setCardLength(user.card.length);
            setCardContent(user.card);
        }
        else {
            setCardLength(0);
            setCardContent();

        }
    }, [flag])

    useEffect(() => {
        window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
        });

        if (productSearch === "" || productSearch === false) {
            axios
                .get(
                    `${REACT_APP_API_ENDPOINT}/user/getProductByType?typeName=${typeName}&brand=null&minRange=${String(value1[0])}&maxRange=${String(value1[1])}`,
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
                        `${REACT_APP_API_ENDPOINT}/user/getProductByType?typeName=${typeName}&brand=${productSearch}&minRange=${String(value1[0])}&maxRange=${String(value1[1])}`,
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
    }, [REACT_APP_API_ENDPOINT, productSearch, value1]);


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

    const Item = ({ product }) => {
        const [count, setCount] = useState(0);

        const handleIncrement = (quantity) => {
            if (quantity < count + 1) {
                return;
            }
            setCount(count + 1);
        };
        const submitAddToCard = () => {
            let addedToCard = { productId: product._id, quantity: count, userId: user.id, product: product }
            dispatch(addToCard(addedToCard));
            setFlag(flag + 1);
        }
        const handleDecrement = () => {
            if (count > 0) {
                setCount(count - 1);
            }
        };

        return (
            <>
                <CardActions className='incrementRows'>
                    <div className='incrementContainer'>
                        <Button style={{ backgroundColor: 'red' }} variant="contained" color="primary" onClick={() => { handleDecrement() }}>
                            -
                        </Button>
                        <span>{count}/{product.quantity}</span>
                        <Button style={{ backgroundColor: 'green' }} variant="contained" color="primary" onClick={() => { handleIncrement(product.quantity) }}>
                            +
                        </Button>
                    </div>
                    <Button style={{ width: '100%' }} variant="contained" color="primary" onClick={() => { submitAddToCard() }}>
                        Add To Card
                    </Button>
                </CardActions>
            </>
        );
    };

    const totalCost = () => {
        let total = 0;
        if (cardContent != undefined) {
            cardContent.map((cardItem) => {
                if (cardItem.product != undefined && cardItem.product.price != undefined) {
                    if (cardItem.product.discount != undefined) {
                        if (cardItem.product.quantity != undefined) {
                            let price = cardItem.product.price - (cardItem.product.price * (cardItem.product.discount / 100));
                            let totalCostItem = price * cardItem.quantity;
                            total = total + totalCostItem;
                        }
                    }
                }
            }
            )
        }
        return parseFloat(total.toFixed(2));
    };

    const handleBuy = () => {
        if (cardContent != undefined) {

            cardContent.map((cardItem) => {
                if (cardItem.quantity != undefined) {
                    if (cardItem.productId != undefined) {

                        axios
                            .post(
                                `${REACT_APP_API_ENDPOINT}/user/addOrder`,
                                {
                                    productId: cardItem.productId,
                                    quantity: cardItem.quantity
                                },
                                {
                                    headers: {
                                        "x-access-token": user.token,
                                        "Content-Type": "application/json",
                                    },
                                }
                            )
                            .then((response) => {

                            })
                            .catch((err) => {
                            });
                    }
                }
            })

            handleClose();
            dispatch(deleteCard());
            setFlag(flag + 1);
        }

    }

    const outOfStock = (productId) => {
        axios
            .post(
                `${REACT_APP_API_ENDPOINT}/user/postOutOfStock`,
                {
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
                setAlert(true);
                const timer = setTimeout(() => {
                    setAlert(false);
                }, 3000);
                return () => {
                    clearTimeout(timer);
                };
            })
            .catch((err) => {
            });

    }
    return (
        <>
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <SnackbarContent
                        message={
                            `Total : ${totalCost()} $`
                        }
                    />
                    {
                        user && user.card && cardContent != undefined &&
                        cardContent.map((cardItem) =>
                            <>
                                <DialogTitle id="alert-dialog-title" style={{ fontSize: '15px' }}>
                                    {cardItem?.quantity} items of {cardItem?.product?.title}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        The one item of {cardItem?.product?.title} cost {cardItem?.product?.price} $
                                        with {cardItem?.product?.discount} % discount
                                    </DialogContentText>
                                </DialogContent>
                            </>
                        )
                    }

                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={() => { handleBuy() }} autoFocus>
                            Buy
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
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
                        {alert && <Alert style={{ width: '70%' }} severity="success" color="info">This is a success alert — check it out!</Alert>
                        }
                        <Button onClick={() => { handleLogout() }} color="inherit">Log Out</Button>


                        <IconButton aria-label="cart" onClick={handleClickOpen}>
                            <StyledBadge badgeContent={cardLength} color="secondary">
                                <ShoppingCartIcon />
                            </StyledBadge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Grid container>
                    <Grid>
                        <List>
                            {['Your Products'].map((text, index) => (
                                <ListItem key={text} disablePadding>
                                    {index === 0 &&
                                        <ListItemButton onClick={() => { navigate("/yourProduct") }}>
                                            <ListItemIcon>
                                                <GroupIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={text} />
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
                            {/* <Button variant="contained" onClick={() => { navigate(`/adminAddProduct/${typeName}`) }}>ADD product</Button> */}

                        </div>
                        <Grid container style={{}}>

                            {allProducts && allProducts.map((product, index) => (

                                <Card sx={{ maxWidth: 345 }}
                                    style={{ marginLeft: '5%', marginBottom: '5%', width: "27%" }}
                                >
                                    {product.img && <CardMedia
                                        sx={{ height: 140 }}
                                        image={product.img}
                                        title="green iguana"
                                    />}

                                    <CardContent>

                                        <div className='onSameLine'>
                                            {
                                                product && product.title &&
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {product?.title}
                                                </Typography>
                                            }
                                            <Button color="secondary" onClick={() => { outOfStock(product._id) }}>
                                                More of {product?.title}  <EmergencyShareIcon />
                                            </Button>
                                        </div>
                                        <Typography variant="body2" color="text.secondary">
                                            <p style={{ color: 'black' }}>Brand:</p>
                                            {product?.brand}
                                        </Typography>
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
                                            {product?.description}
                                        </Typography>
                                    </CardContent>
                                    <Item key={index} product={product} />

                                </Card>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default ProductUserPage;
