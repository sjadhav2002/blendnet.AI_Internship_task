import React, { useEffect} from 'react'
import "./dashboard.css"
import BasePage from '../../Components/Base_Page/base';
import {  Grid, useMediaQuery, MenuItem, FormControl, Select} from '@mui/material';

const Dashboard: React.FC = () => {
    const access_token = window.sessionStorage.getItem("access")
    const isMobile = useMediaQuery('(max-width:600px)');


    const get_data = () => {
        
        fetch('http://127.0.0.1:8000/user/dashboard/', {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log(data)
        })
        .catch(error => {
          console.error('Error:', error);
        });
      };


      useEffect(() => {
        get_data()
      }, []);

    const maincontent = (
        <div>
            <Grid container>
                {!isMobile && (
                    <Grid item xs={4}> {/* Adjust the column size as per your requirement */}
                    {/* Content for left column */}
                    

                    </Grid>
                )}

                <Grid item xs={isMobile ? 12 : 8}> {/* Adjust the column size as per your requirement */}
                    {/* Content for right column */}
                    {isMobile && (
                    <FormControl fullWidth>
                        <Select>
                        <MenuItem value={1}>Option 1</MenuItem>
                        <MenuItem value={2}>Option 2</MenuItem>
                        {/* Add more options as needed */}
                        </Select>
                    </FormControl>
                    )}
                </Grid>
            </Grid>
        </div>
    )
    return <BasePage maincontent={maincontent} signin={true} />;
}

export default Dashboard;