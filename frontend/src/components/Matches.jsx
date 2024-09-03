
import React from 'react';
import axios from 'axios';

import './Matches.css'
import {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'; 

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


export const Matches =() => {
    return <>
        <div className="match-info">
            <h1>Match History</h1>
        </div>

    
    
    </>
};