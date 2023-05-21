import React, { useState, useEffect } from 'react';
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
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { login } from "../../reducers/userSlice.js";

const theme = createTheme();
const { REACT_APP_API_ENDPOINT } = process.env;

export default function SignIn() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [alert, setAlert] = useState(false);
    const user = useSelector((state) => state.userSlice.user);

    useState(() => {
        Aos.init({ duration: 2000 });
    }, []);

    useEffect(() => {
        if (user) {
            if (user.role === "admin") {
                navigate("/dashboardAdmin");
                return;
            }
            if (user.role === "user") {
                navigate("/dashboardUser");
                return;
            }
        }
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        axios
            .post(
                `${REACT_APP_API_ENDPOINT}/auth/login`,
                {
                    phone: data.get('phone'),
                    password: data.get('password'),
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                dispatch(
                    login({
                        id: response.data.user._id,
                        phone: response.data.phone,
                        name: response.data.user.name,
                        address1: response.data.address1,
                        address2: response.data.address2,
                        card: null,
                        role: response.data.user.rol,
                        loggedIn: true,
                        token: response.data.token,
                    })
                );
                if (response.data.user.rol === "admin") {
                    navigate("/dashboardAdmin");
                }
                if (response.data.user.rol === "user") {
                    navigate("/dashboardUser");
                }
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
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} data-aos="fade-up">
                        <LockIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="phone"
                            label="Phone Number"
                            name="phone"
                            autoComplete="phone"
                            autoFocus
                            data-aos="fade-right"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            data-aos="fade-left"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                    </Box>
                    <Grid container spacing={8}>
                        <Grid item xs={8}>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                type="submit"
                                variant="outlined"
                                onClick={() => { navigate("/register") }}
                            >
                                Sign Up
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                {
                    alert &&
                    <Alert severity="error" onClose={() => { setAlert(false) }}>wrong phone or password!</Alert>
                }
            </Container>
        </ThemeProvider>
    );
}