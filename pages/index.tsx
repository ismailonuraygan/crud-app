import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
import {prisma} from '../lib/prisma' 
import { useRouter } from 'next/router';



interface FormData {
  title:  string
  content: string
  id: string
}

interface Notes{
  notes: {
    map(arg0: (note: any) => JSX.Element): import("react").ReactNode
    id: string,
    title: string,
    content: string
  }
}


const Home = ({notes}: Notes) => {
  const [form, setForm]= useState<FormData> ({title:"", content:"", id:""})

  async function create(data: FormData) {
    try{
      fetch("http://localhost:3000/api/create", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }, 
        method: "POST"
      }).then(()=> {
        setForm({title:"" , content:"", id:""})
        refreshData()
      })
    }catch(err){
      console.log(err);
    }
  }

  async function deleteNote(id: string) {
    try{
      fetch(`http://localhost:3000/api/note/${id}`, {
        headers: {"Content-Type": "application/json"},
        method : "DELETE"
      }).then(() => {refreshData()})
    }catch(err){
      console.log(err);
    }
  }

  const handleSubmit = async (data: FormData) =>{
    try{
      create(data)
    }
    catch(err){
      console.log(err)
    }
  }

  const router = useRouter();
  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    router.replace(router.asPath);
  }

  return (
    <div className="">
      <h1 className='text-center font-bold text-2xl mt-5'>Notes</h1>
      <form 
        onSubmit={e => {
           e.preventDefault()
           handleSubmit(form)
        }}
        className="w-auto min-w-[25] max-w-md mx-auto space-y-6 flex flex-col items-stretch"
        >
        <input 
          type="text"
          placeholder='Title'
          value={form.title}
          onChange={e => setForm({...form , title: e.target.value})}
          className= "border-2 rounded border-gray-500 p-1"
          />
        <textarea 
          placeholder='Content'
          value={form.content}
          onChange={e => setForm({...form , content: e.target.value})}
          className= "border-2 rounded border-gray-500 p-1"
          />
          <button 
           type="submit" className='border-2 bg-blue-500 text-white rounded   p-1'>Add +</button>
      </form>
      <div className="w-auto min-w-[25] max-w-md  mx-auto mt-20 space-y-6 flex flex-col items-stretch">
          <ul>
            {notes.map(note => (
              <li key={note.id} className="border-b border-gray-500 p-2">
                <div className='flex justify-between'>
                    <div className='flex-1'>
                      <h3 className='font-bold'>{note.title}</h3>
                      <p className='text-sm'>{note.content}</p>
                    </div>
                    <button onClick={()=> deleteNote(note.id)} className="bg-red-500 text-white px-3">
                      X
                    </button>
                </div> 
              </li>
            ))}
          </ul>
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: {
      title: true,
      id: true,
      content: true
    }
  })

  return {
    props: {
      notes
    }
  }
}