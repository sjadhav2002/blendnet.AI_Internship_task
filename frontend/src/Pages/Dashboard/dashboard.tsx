import React, { FormEvent, useEffect, useState } from "react";
import "./dashboard.css";
import BasePage from "../../Components/Base_Page/base";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
    Grid,
    useMediaQuery,
    MenuItem,
    FormControl,
    Select,
    Typography,
    Card,
    CardContent,
    Button,
    IconButton,
    Checkbox,
    Modal,
    TextField,
} from "@mui/material";
import { Add, Check, Edit } from "@mui/icons-material";
import { ChangeEvent } from "react";
import Default_perf from './../../Components/Default_performance_page/Default_perf';
import Watchlist_perf from "../../Components/Watchlist_performance Page/Watchlist_perf";

interface Company {
    [key: string]: any;
}

interface company_details {
    watchlist: string;
    name: string;
    symbol: string;
    perf_today: number;
    perf_10day: number;
    perf_30day: number;
    high_today: number;
    high_10day: number;
    high_30day: number;
    low_today: number;
    low_10day: number;
    low_30day: number;
}
interface PerfMetrics {
    max_perf_today: company_details;
    min_perf_today: company_details;
    max_perf_10day: company_details;
    min_perf_10day: company_details;
    max_perf_30day: company_details;
    min_perf_30day: company_details;
}
interface Company_Data {
    symbol: string;
    name: string;
    exchange: string;
    assetType: string;
}

interface Watchlist {
    id: number;
    name: string;
    user: string;
    // Add more properties if there are any
}

type WatchlistCompanies = Record<string, Company[]>;

const Dashboard: React.FC = () => {
    const isMobile = useMediaQuery("(max-width:600px)");
    const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
    const [username, setUsername] = useState<string>("");
    const [watchlistCompany, setWatchlistCompany] = useState<WatchlistCompanies>({});
    const [selectedWatchlist, setSelectedWatchlist] = useState<number | null>(null);
    const [selectedWatchlistname, setSelectedWatchlistname] = useState<string>("");
    const [allCompanies, setAllCompanies] = useState<Company_Data[]>();
    const [editClicked, setEditClicked] = useState<boolean>(false);
    const [selectedWatchlists, setselectedWatchlists] = useState<string[]>([]);
    const [csrfToken, setcsrfToken] = useState<string>("null");
    const [addWatchlistName, setAddWatchlistName] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [openCompanies, setOpenCompanies] = useState<boolean>(false);
    const handleOpenCompanies = (name: string) => { setOpenCompanies(true); setSelectedWatchlistname(name) }
    const handleCloseCompanies = () => setOpenCompanies(false);
    const [perfMetrics, setPerfMetrics] = useState<PerfMetrics>()
    const [selectedWatchlistPerfMetrics, setSelectedWatchlistPerfMetrics] = useState<PerfMetrics | null>()
    const [selectedCompany, setSelectedCompany] = useState<string>("")

    const get_data = () => {
        fetch("http://127.0.0.1:8000/user/dashboard/", {
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {

                setUsername(data["user"]);
                if (data["watchlists"].length !== 0) {
                    setWatchlists(data["watchlists"]);
                }
                setWatchlistCompany(data["watchlist_companies"]);
                setAllCompanies(data["allCompanies"]);
                if (data['perf_metrics']) {
                    setPerfMetrics(data['perf_metrics'])
                }
                getcsrftoken();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    useEffect(() => {
        get_data();
    }, []);

    const showCompanies = (id: number) => {
        setSelectedWatchlist((prevId) => (prevId === id ? null : id));
        getWatchlistPerf(id)
    };

    const displayCheckboxes = () => {
        setEditClicked((prevId) => (prevId === true ? false : true));
    };

    const updateSelectedList = (
        event: ChangeEvent<HTMLInputElement>,
        symbol: string
    ) => {
        if (event.target.checked) {
            setselectedWatchlists((prevSelected) => [...prevSelected, symbol]);
        } else {
            setselectedWatchlists((prevSelected) =>
                prevSelected.filter((item) => item !== symbol)
            );
        }
    };

    const getcsrftoken = () => {
        fetch("http://127.0.0.1:8000/auth/get_csrf/", {
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setcsrfToken(data.csrfToken);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const update_watchlists = () => {
        fetch("http://127.0.0.1:8000/user/removeWatchlist/", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify({ selectedWatchlists: selectedWatchlists }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleaddwatchlist = () => {
        getcsrftoken()
        fetch("http://127.0.0.1:8000/user/addWatchlist/", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify({ name: addWatchlistName }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const isCompanyInWatchlist = (symbol: string) => {
        if (watchlistCompany[selectedWatchlistname]) {
            return watchlistCompany[selectedWatchlistname].some(item => item["symbol"] === symbol);
        }
        return false;
    };

    const updatewatchlistcompanies = (event: ChangeEvent<HTMLInputElement>, company: Company_Data) => {
        var currentwatchlist = watchlistCompany[selectedWatchlistname]
        if (!currentwatchlist) {
            currentwatchlist = [];
        }
        if (event.target.checked) {
            currentwatchlist.push(company);
        }
        else {
            currentwatchlist = currentwatchlist.filter((item) => item["symbol"] !== company.symbol);
        }
        setWatchlistCompany({
            ...watchlistCompany,
            [selectedWatchlistname]: currentwatchlist,
        });
    };

    const updatecompaniesinwatchlist = () => {
        fetch("http://127.0.0.1:8000/user/addCompanyToWatchlist/", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify({ 'companydata': watchlistCompany, 'updatedwatchlist': selectedWatchlistname }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    const getWatchlistPerf = (id: number) => {
        fetch("http://127.0.0.1:8000/user/getWatchlistPerf/", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify({ 'watchlist': id }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                if (data['perf_metrics']) {
                    setSelectedWatchlistPerfMetrics(data['perf_metrics'])
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    const maincontent = (
        <div>
            {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign:'center' }}> Welcome {username}</Typography> */}
            <Grid container style={{ height: "90vh" }}>
                {!isMobile && (
                    <Grid item xs={2} className="side_nav">
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, margin: "10px", color: "white" }}
                        >
                            My Watchlists
                            <IconButton onClick={handleOpen}>
                                <Add style={{ color: "white" }} />
                            </IconButton>
                            {selectedWatchlists.length === 0 && (
                                <IconButton
                                    onClick={() => {
                                        displayCheckboxes();
                                    }}
                                >
                                    <Edit style={{ color: "white" }} />
                                </IconButton>
                            )}
                            {editClicked && selectedWatchlists.length !== 0 && (
                                <IconButton
                                    onClick={() => {
                                        update_watchlists();
                                    }}
                                >
                                    <Check style={{ color: "white" }} />
                                </IconButton>
                            )}
                        </Typography>
                        {watchlists.length !== 0 && (watchlists.map((item, index) => (
                            <div>
                                <Card
                                    key={item["id"]}
                                    onClick={() => showCompanies(item["id"])}
                                    variant="outlined"
                                    className="m-2"
                                >
                                    <CardContent className="card_watchlist">
                                        {editClicked ? (
                                            <Checkbox
                                                onChange={(e) => updateSelectedList(e, item["name"])}
                                            />
                                        ) : null}
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ flexGrow: 1, display: 'inline-flex', alignItems: 'center' }}
                                            component="div"
                                        >
                                            {item["name"]}
                                            <KeyboardArrowDownIcon />
                                            {selectedWatchlist === item['id'] ? (
                                                <div>
                                                    <IconButton onClick={() => handleOpenCompanies(item["name"])}>
                                                        <Edit style={{ color: "black" }} />
                                                    </IconButton>
                                                </div>
                                            ) : null}
                                        </Typography>
                                    </CardContent>
                                </Card>
                                <div
                                    className={
                                        selectedWatchlist === item["id"]
                                            ? "transition-container show"
                                            : "transition-container hide"
                                    }
                                >
                                    {watchlistCompany[item["name"]] && watchlistCompany[item["name"]].map((item1, index2) => (
                                        <Typography
                                            key={item1["name"]}
                                            variant="subtitle1"
                                            sx={{ flexGrow: 1, textAlign: "center", color: "white" }}
                                            component="div"
                                        >
                                            <Button
                                                onClick={() => setSelectedCompany(item1["symbol"])}
                                                style={{ color: "white" }}
                                            >
                                                {item1["name"]}
                                            </Button>
                                        </Typography>
                                    ))}
                                </div>
                            </div>
                        )))}
                    </Grid>
                )}

                <Grid item className="p-2" xs={isMobile ? 12 : 10}>
                    {isMobile && (
                        <Grid>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{ flexGrow: 1, margin: "10px", color: "white" }}
                            >
                                My Watchlists
                                <IconButton onClick={handleOpen}>
                                    <Add style={{ color: "white" }} />
                                </IconButton>
                                {selectedWatchlists.length === 0 && (
                                    <IconButton
                                        onClick={() => {
                                            displayCheckboxes();
                                        }}
                                    >
                                        <Edit style={{ color: "white" }} />
                                    </IconButton>
                                )}
                                {editClicked && selectedWatchlists.length !== 0 && (
                                    <IconButton
                                        onClick={() => {
                                            update_watchlists();
                                        }}
                                    >
                                        <Check style={{ color: "white" }} />
                                    </IconButton>
                                )}
                            </Typography>
                            {watchlists.map((item, index) => (
                                <div>
                                    <Card
                                        key={item["id"]}
                                        onClick={() => showCompanies(item["id"])}
                                        variant="outlined"
                                        className="m-2"
                                    >
                                        <CardContent className="card_watchlist">
                                            {editClicked ? (
                                                <Checkbox
                                                    onChange={(e) => updateSelectedList(e, item["name"])}
                                                />
                                            ) : null}
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ flexGrow: 1, display: 'inline-flex', alignItems: 'center' }}
                                                component="div"
                                            >
                                                {item["name"]}
                                                <KeyboardArrowDownIcon />
                                                {selectedWatchlist === item['id'] ? (
                                                    <div>
                                                        <IconButton onClick={() => handleOpenCompanies(item["name"])}>
                                                            <Edit style={{ color: "black" }} />
                                                        </IconButton>
                                                    </div>
                                                ) : null}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                    <div
                                        className={
                                            selectedWatchlist === item["id"]
                                                ? "transition-container show"
                                                : "transition-container hide"
                                        }
                                    >
                                        {watchlistCompany[item["name"]].map((item1, index2) => (
                                            <Typography
                                                key={item1["name"]}
                                                variant="subtitle1"
                                                sx={{ flexGrow: 1, textAlign: "center", color: "white" }}
                                                component="div"
                                            >
                                                <Button
                                                    onClick={() => setSelectedCompany(item1["symbol"])}
                                                    style={{ color: "white" }}
                                                >
                                                    {item1["name"]}
                                                </Button>
                                            </Typography>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </Grid>
                    )}
                    {selectedWatchlist === null && (
                        <Default_perf perfMetrics={perfMetrics ? perfMetrics : null} />
                    )}
                    {selectedWatchlist !== null && (
                        <Watchlist_perf perfMetrics={selectedWatchlistPerfMetrics ? selectedWatchlistPerfMetrics : null} watchlistname={selectedWatchlist} selectedCompany={selectedCompany} csrfToken={csrfToken} />
                    )}

                </Grid>

            </Grid>

            <Modal open={open} onClose={handleClose}>
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        outline: "none",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1, textAlign: "center" }}
                        component="div"
                    >
                        Create New Watchlist
                    </Typography>
                    <TextField
                        label="Watchlist Name"
                        variant="outlined"
                        value={addWatchlistName}
                        onChange={(e) => setAddWatchlistName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" onClick={handleaddwatchlist}>
                        Submit
                    </Button>
                </div>
            </Modal>

            <Modal open={openCompanies} onClose={handleCloseCompanies}>
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        outline: "none", maxHeight: '50vh', overflowY: 'scroll'
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1, textAlign: "center" }}
                        component="div"
                    >
                        Edit Companies
                        <IconButton onClick={updatecompaniesinwatchlist} style={{ float: 'right' }}>
                            <Check />
                        </IconButton>
                    </Typography>
                    {allCompanies?.map((item, index) => (
                        <Typography
                            variant="subtitle1"
                            sx={{ flexGrow: 1, textAlign: "left" }}
                            component="div"
                        >
                            <Checkbox checked={isCompanyInWatchlist(item.symbol)} onChange={(e) => updatewatchlistcompanies(e, item)} />{item.name}
                        </Typography>

                    ))}
                </div>
            </Modal>
        </div>
    );
    return <BasePage maincontent={maincontent} signin={true} />;
};

export default Dashboard;
