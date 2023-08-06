import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import axios from 'axios'
import PokeCard from './components/PokeCard'
import { useDebounce } from './hooks/useDebounce'

function App() {
  //모든 포켓몬 데이터를 가지고 있는 State
  const [allPokemons, setAllPokemons] = useState([])
  //실제로 리스트로 보여지는 포켓몬을 가지고 있는 State
  const [displayedPokemons, setDisplayedPokemons] = useState([])

  //한번에 보여지는 포켓몬 수
  const limitNum =20

  const url =`https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0`;


 
  const [serachTerm, setSerachTerm] = useState("")

  const debouncedSearchTerm = useDebounce(serachTerm, 500)

    useEffect(() =>{
      fetchPokeData();
    },[])

    useEffect(() => {
      handleSearchInput(debouncedSearchTerm) 
    }, [debouncedSearchTerm])
    

    function filterDisplayedPokemonData(allPokemonsData, displayedPokemons = []) { 
      const limit = displayedPokemons.length + limitNum;
      //모든 포켓몬 데이터에서 limitNum만큼 더 가져오기
      const array = allPokemonsData.filter((pokemon,index)=> index+1 <= limit);
      return array
    }
  

    const fetchPokeData= async ()=>{
      try{
        //1008개의 포켓몬 데이터 받아오기
        const response = await axios.get(url);
        //모든 포켓몬 데이터 기억하기
        setAllPokemons(response.data.results)
        //실제로 보여줄 포켓몬데이터
        setDisplayedPokemons(filterDisplayedPokemonData(response.data.results))
      }catch (error){
        console.error(error);
        }
    }

    const handleSearchInput = async(serachTerm)=>{

      if(serachTerm.length >0 ){
          try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${serachTerm}`)
            const pokemonData ={
              url: `https://pokeapi.co/api/v2/pokemon/${response.data.id}`,
              name: serachTerm,
            }
            setPokemons([pokemonData]);
          } catch (error) {
            setPokemons([]);
            console.error(error);
          }
      }else{
        fetchPokeData(true)
      }
    }


  return (
    <article className='pt-6'>
      <header className='flex flex-col gap-2 w-full px-4 z-50'>
      <div className='relative z-50'>
        <form className='relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto'>
          <input 
          type="text" 
          className='text-xs w-[20.5rem] h-6 px-2 py-1 bg-[hsl(214,13%,47%)] rounded-lg text-gray-300 text-center'
          value={serachTerm}
          onChange={(e)=>setSerachTerm(e.target.value)}/>
            <button type="submit" className='text-xs bg-slate-900 text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-r-lg text-center absolute right-0 hover:bg-slate-700'>
              검색
            </button>
        </form>

      </div>
      </header>
      <section className='pt-6 flex flex-col justify-content items-center overflow-auto z-0'>
      <div className='flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl'>
        {displayedPokemons.length >0 ? 
        (
          displayedPokemons.map(({url, name},index)=>(
            <PokeCard key ={url} url={url} name={name}/>
          ))
          )
          :
          (
          <h2 className='font-medium text-lg text-slate-900 mb-1'>
            포켓몬이 없습니다.
          </h2>
          )
          }
      </div>
      </section>
      <div className='text-center'>
      {(allPokemons.length >displayedPokemons.length) && (displayedPokemons.length !==1) &&(
        <button
            onClick={()=>setDisplayedPokemons(filterDisplayedPokemonData(allPokemons, displayedPokemons))}
           className='bg-slate-800 px-6 py-2 my-2 text-base rounded-lg font-blod text-white'>
            더 보기
          </button>
      )}

      </div>
    </article>
  )
}

export default App
