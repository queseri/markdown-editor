/* eslint-disable react/destructuring-assignment */
import React, { createContext, useEffect, useState } from 'react'
import { API_ENDPOINT_PATH } from '../config'
import { ContentTypes } from './Types'

const defaultState = {   
    ID: '634a235f414b8ab9c0b700e3',
    fetchStatus: 'string',
}

export const ContentContext = createContext<ContentTypes>(defaultState)

export function ContentProvider(props: { children: any }) {
    
    const [ID, setNewID] = useState(defaultState.ID)
    const [title, setTitle] = useState('')
    const [markdownContent, setMarkdownContent] = useState('')
    const [data, setData] =  useState([] as any[]);
    const [fetchStatus, setFetchStatus] = useState("idle")
   
    function changeContent(id: React.SetStateAction<string>) {
        // id is used to control the items to be viewed , 
        // when the id has changed so as the heading and content should change
        setNewID(id)
    }

    // Get data on load from mongodb
  useEffect(() => {
    // load data from mongo db  
    const fetchFiles = async () => {
      const response = await fetch(`${API_ENDPOINT_PATH}`);
      const json = await response.json();
      if (response.ok) {
        setData(json);  
        setFetchStatus("success")    
      }
    };
  
    if (data && data.length > 0) {
        setNewID(data?.[0]._id)
        setTitle(data?.[0].name)
        setMarkdownContent(data?.[0].content)
    }
   
    fetchFiles();
  }, [data.length]);
    
    useEffect(() => {
        // setNewID(ID)              
    }, [ID])
    
    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values, react/jsx-no-comment-textnodes
        <ContentContext.Provider value={{ ID, changeContent, title, setTitle, markdownContent, setMarkdownContent, data , fetchStatus, setData}}>           
            {props.children}
        </ContentContext.Provider>
    )
}