import { auth } from "@/config/environment/firebase";
import { themeColors } from "@/config/theme";
import { useUser } from "@/providers/user";
import { ExitToApp, FilterAltOutlined, PictureAsPdf, SearchOutlined } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FilledInput,
    FormControl,
    InputAdornment,
    Snackbar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { signOut } from "firebase/auth";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import terniumLogo from "../../public/assets/imgs/ternium_color.png";

function Search() {
    const [open, setOpen] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const { user } = useUser();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickSnack = () => {
        setOpenSnack(true);
    };

    const handleCloseSnack = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnack(false);
    };

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {})
            .catch((error) => {
                handleClickSnack;
            });
    };

    return (
        <Box sx={{ bgcolor: "white", height: "100vh", width: "100%" }}>
            {/* <button onClick={handleClickSnack}>Hola</button> */}
            <Snackbar
                open={openSnack}
                autoHideDuration={6000}
                onClose={handleCloseSnack}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={handleCloseSnack} severity="error" sx={{ width: "100%" }}>
                    Ocurrio un error!
                </Alert>
            </Snackbar>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">Descargar 14 archivos</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Estás seguro que quieres descargar todos los archivos?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleClose} autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
            <Head>
                <title>Search</title>
                <meta name="description" content="Busqueda de empleados." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 3,
                    paddingBottom: 1,
                }}
            >
                <Image src={terniumLogo} alt="Logo de la barra de navegación" width={128} />
                <Box sx={{ width: "60%" }}>
                    <FormControl fullWidth sx={{ m: 1 }} variant="filled">
                        <FilledInput
                            placeholder="Buscar"
                            id="filled-adornment-search"
                            startAdornment={
                                <InputAdornment position="start">
                                    <SearchOutlined sx={{ mr: 1 }} />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </Box>
                <Link href="/">
                    <Button
                        variant="text"
                        startIcon={<ExitToApp />}
                        sx={{ color: themeColors.grisAceroTernium }}
                        onClick={handleSignOut}
                    >
                        Cerrar Sesion
                    </Button>
                </Link>
            </Box>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        width: "59%",
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                    }}
                >
                    <Button
                        variant="contained"
                        startIcon={<FilterAltOutlined />}
                        sx={{
                            color: themeColors.grisAceroTernium,
                            backgroundColor: "#D9D9D9",
                            marginRight: 1,
                        }}
                    >
                        Filtros
                    </Button>
                    <Button
                        onClick={handleClickOpen}
                        variant="outlined"
                        startIcon={<PictureAsPdf />}
                        sx={{
                            position: "fixed",
                            bottom: "20px",
                            right: "20px",
                        }}
                    >
                        Descargar
                    </Button>
                    <Chip
                        sx={{ marginRight: 1 }}
                        label="Nombre: A-Z"
                        variant="outlined"
                        onDelete={() => console.log("hola")}
                    />
                    <Chip
                        sx={{ marginRight: 1 }}
                        label="Performace: Mayor a 3"
                        variant="outlined"
                        onDelete={() => console.log("hola")}
                    />
                </Box>
            </Box>
            <Box
                sx={{
                    marginTop: 2,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        width: "59%",
                        height: "75vh",
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                    }}
                >
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 8,
                                },
                            },
                        }}
                        pageSizeOptions={[5]}
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Box>
            </Box>
        </Box>
    );
}
const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
        field: "firstName",
        headerName: "First name",
        width: 150,
        editable: true,
    },
    {
        field: "lastName",
        headerName: "Last name",
        width: 150,
        editable: true,
    },
    {
        field: "age",
        headerName: "Age",
        type: "number",
        width: 110,
        editable: true,
    },
    {
        field: "fullName",
        headerName: "Full name",
        description: "This column has a value getter and is not sortable.",
        sortable: false,
        width: 160,
        valueGetter: (params: { row: { firstName: any; lastName: any } }) =>
            `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
];

const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];
export default Search;
