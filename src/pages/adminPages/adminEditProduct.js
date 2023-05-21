import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, useParams } from 'react-router-dom';
import { logout } from "../../reducers/userSlice.js";

import axios from "axios";
import Aos from "aos";
import "aos/dist/aos.css";
import Avatar from '@mui/material/Avatar';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const theme = createTheme();
const { REACT_APP_API_ENDPOINT } = process.env;

export default function AdminEditProduct() {
    const { productId } = useParams();
    const { typeName } = useParams();
    const { productTitle } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [alert, setAlert] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(false);
    const user = useSelector((state) => state.userSlice.user);

    useState(() => {
        Aos.init({ duration: 2000 });
    }, []);

    useEffect(() => {
        if (!user && user.role != "admin") {
            dispatch(logout());
            navigate("/");
            return;
        }
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        axios
            .post(
                `${REACT_APP_API_ENDPOINT}/admin/editProduct`,
                {
                    idProduct: productId,
                    title: data.get('title'),
                    brand: data.get('brand'),
                    type: typeName,
                    price: data.get('price'),
                    quantity: data.get('quantity'),
                    discount: data.get('discount'),
                    description: data.get('description'),
                    img: data.get('img')
                },
                {
                    headers: {
                        "x-access-token": user.token,
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                setAlertSuccess(true)
            })
            .catch((err) => {
                setAlert(true)
            });

    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Edit Product: {productTitle} To Type : {typeName}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="title"
                            label="title"
                            name="title"
                            autoComplete="title"
                            autoFocus
                            data-aos="fade-right"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="brand"
                            label="Brand"
                            name="brand"
                            autoComplete="Brand"
                            autoFocus
                            data-aos="fade-right"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="price"
                            label="price"
                            type="number"
                            id="price"
                            data-aos="fade-left"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="quantity"
                            label="Quantity"
                            type="number"
                            id="quantity"
                            autoComplete="quantity"
                            data-aos="fade-left"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="discount"
                            label="Discount"
                            type="number"
                            id="discount"
                            autoComplete="discount"
                            data-aos="fade-left"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="description"
                            label="Description"
                            type="description"
                            id="description"
                            autoComplete="description"
                            data-aos="fade-left"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="img"
                            label="img"
                            type="img"
                            id="img"
                            autoComplete="img"
                            data-aos="fade-left"
                        />
                        <Button
                            type="primary"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>
                {
                    alert &&
                    <Alert severity="error" onClose={() => { setAlert(false) }}>error!</Alert>
                }
                {
                    alertSuccess &&
                    <Alert severity="success" onClose={() => { setAlert(false) }}>Product Added Successfully!</Alert>
                }
            </Container>
        </ThemeProvider>
    );
}