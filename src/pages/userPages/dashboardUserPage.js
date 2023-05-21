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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Toolbar from '@mui/material/Toolbar';
import { deleteCard } from "../../reducers/userSlice.js";
import SnackbarContent from '@mui/material/SnackbarContent';
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
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListItemText from '@mui/material/ListItemText';
import axios from "axios";
const { REACT_APP_API_ENDPOINT } = process.env;

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));

const DashboardUserPage = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.userSlice.user);
    const dispatch = useDispatch();
    const [allTypes, setAllTypesState] = useState([]);
    const [typeSearch, setTypeSearch] = useState(false);
    const [cardLength, setCardLength] = useState(0);
    const [flag, setFlag] = useState(0);
    const [cardContent, setCardContent] = useState();
    const [open, setOpen] = React.useState(false);

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
        if (typeSearch === "" || typeSearch === false) {
            axios
                .get(
                    `${REACT_APP_API_ENDPOINT}/user/getAllTypes?typeSearch=null`,
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
                        `${REACT_APP_API_ENDPOINT}/user/getAllTypes?typeSearch=${typeSearch}`,
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
                        <TextField id="SearchType" label="Search for a type..." variant="standard" style={{ marginLeft: '5%', width: "30%" }}
                            value={typeSearch ? typeSearch : ""}
                            onChange={(e) => setTypeSearch(e.target.value)}
                        />
                        <ImageList sx={{ width: '100%', height: '100%', padding: '5%' }} style={{ overflow: 'hidden' }}>
                            {allTypes && allTypes.map((type) => (
                                <ImageListItem key={type.image} onClick={() => { navigate(`/productUser/${type.typeName}`) }}>
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

export default DashboardUserPage;
