"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Droplets, Wind, Search } from "lucide-react"

// Liste des villes françaises à afficher
const FRENCH_CITIES = [
  "Paris",
  "Marseille",
  "Lyon",
  "Toulouse",
  "Nice",
  "Nantes",
  "Strasbourg",
  "Montpellier",
  "Bordeaux",
  "Lille",
  "Rennes",
  "Reims",
]

interface WeatherData {
  city: {
    name: string
    country: string
  }
  update: string
  forecast: {
    temp2m: number
    rh2m: number
    wind10m: number
    weather: number
  }
}

const weatherDescriptions: { [key: number]: string } = {
  0: "Soleil",
  1: "Peu nuageux",
  2: "Ciel voilé",
  3: "Nuageux",
  4: "Très nuageux",
  5: "Couvert",
  6: "Brouillard",
  7: "Brouillard givrant",
  10: "Pluie faible",
  11: "Pluie modérée",
  12: "Pluie forte",
  13: "Pluie faible verglaçante",
  14: "Pluie modérée verglaçante",
  15: "Pluie forte verglaçante",
  16: "Bruine",
  20: "Neige faible",
  21: "Neige modérée",
  22: "Neige forte",
  30: "Pluie et neige mêlées faibles",
  31: "Pluie et neige mêlées modérées",
  32: "Pluie et neige mêlées fortes",
  40: "Averses de pluie locales et faibles",
  41: "Averses de pluie locales",
  42: "Averses locales et fortes",
  43: "Averses de pluie faibles",
  44: "Averses de pluie",
  45: "Averses de pluie fortes",
  46: "Averses de pluie faibles et fréquentes",
  47: "Averses de pluie fréquentes",
  48: "Averses de pluie fortes et fréquentes",
  60: "Averses de neige localisées et faibles",
  61: "Averses de neige localisées",
  62: "Averses de neige localisées et fortes",
  63: "Averses de neige faibles",
  64: "Averses de neige",
  65: "Averses de neige fortes",
  66: "Averses de neige faibles et fréquentes",
  67: "Averses de neige fréquentes",
  68: "Averses de neige fortes et fréquentes",
  70: "Averses de pluie et neige mêlées localisées et faibles",
  71: "Averses de pluie et neige mêlées localisées",
  72: "Averses de pluie et neige mêlées localisées et fortes",
  73: "Averses de pluie et neige mêlées faibles",
  74: "Averses de pluie et neige mêlées",
  75: "Averses de pluie et neige mêlées fortes",
  76: "Averses de pluie et neige mêlées faibles et nombreuses",
  77: "Averses de pluie et neige mêlées fréquentes",
  78: "Averses de pluie et neige mêlées fortes et fréquentes",
  100: "Orages faibles et locaux",
  101: "Orages locaux",
  102: "Orages fort et locaux",
  103: "Orages faibles",
  104: "Orages",
  105: "Orages forts",
  106: "Orages faibles et fréquents",
  107: "Orages fréquents",
  108: "Orages forts et fréquents",
  120: "Orages faibles et locaux de neige ou grésil",
  121: "Orages locaux de neige ou grésil",
  122: "Orages locaux de neige ou grésil",
  123: "Orages faibles de neige ou grésil",
  124: "Orages de neige ou grésil",
  125: "Orages de neige ou grésil",
  126: "Orages faibles et fréquents de neige ou grésil",
  127: "Orages fréquents de neige ou grésil",
  128: "Orages fréquents de neige ou grésil",
  130: "Orages faibles et locaux de pluie et neige mêlées ou grésil",
  131: "Orages locaux de pluie et neige mêlées ou grésil",
  132: "Orages fort et locaux de pluie et neige mêlées ou grésil",
  133: "Orages faibles de pluie et neige mêlées ou grésil",
  134: "Orages de pluie et neige mêlées ou grésil",
  135: "Orages forts de pluie et neige mêlées ou grésil",
  136: "Orages faibles et fréquents de pluie et neige mêlées ou grésil",
  137: "Orages fréquents de pluie et neige mêlées ou grésil",
  138: "Orages forts et fréquents de pluie et neige mêlées ou grésil",
  140: "Pluies orageuses",
  141: "Pluie et neige mêlées à caractère orageux",
  142: "Neige à caractère orageux",
  210: "Pluie faible intermittente",
  211: "Pluie modérée intermittente",
  212: "Pluie forte intermittente",
  220: "Neige faible intermittente",
  221: "Neige modérée intermittente",
  222: "Neige forte intermittente",
  230: "Pluie et neige mêlées",
  231: "Pluie et neige mêlées",
  232: "Pluie et neige mêlées",
  235: "Averses de grêle",
}

export default function Home() {
  const [city, setCity] = useState("")
  const [searchWeather, setSearchWeather] = useState<WeatherData | null>(null)
  const [citiesWeather, setCitiesWeather] = useState<WeatherData[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const getWeather = useCallback(async (cityName: string): Promise<WeatherData | null> => {
    try {
      const response = await fetch(`https://www.prevision-meteo.ch/services/json/${cityName}`)
      if (!response.ok) {
        throw new Error("Ville non trouvée")
      }
      const data = await response.json()
      return {
        city: {
          name: data.city_info.name,
          country: "FR",
        },
        update: data.current_condition.date,
        forecast: {
          temp2m: data.current_condition.tmp,
          rh2m: data.current_condition.humidity,
          wind10m: data.current_condition.wnd_spd,
          weather: data.current_condition.condition_id,
        },
      }
    } catch (err) {
      console.error(`Erreur pour ${cityName}:`, err)
      return null
    }
  }, [])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    try {
      const data = await getWeather(city)
      if (data) {
        setSearchWeather(data)
        setError(null)
      } else {
        throw new Error("Ville non trouvée")
      }
    } catch (err) {
      setSearchWeather(null)
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    }
  }

  useEffect(() => {
    async function fetchCitiesWeather() {
      setLoading(true)
      const weatherPromises = FRENCH_CITIES.map((city) => getWeather(city))
      const results = await Promise.all(weatherPromises)
      setCitiesWeather(results.filter((data): data is WeatherData => data !== null))
      setLoading(false)
    }

    fetchCitiesWeather()
  }, [getWeather])

  function WeatherCard({ weather }: { weather: WeatherData }) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg">
              {weather.city.name}, {weather.city.country}
            </span>
            <span className="text-2xl font-bold">{Math.round(weather.forecast.temp2m)}°C</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">
                {weatherDescriptions[weather.forecast.weather] || "Inconnu"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">Humidité: {weather.forecast.rh2m}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">Vent: {weather.forecast.wind10m} km/h</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <main className="container mx-auto p-4 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">Météo en France</h1>

        {/* Formulaire de recherche */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Rechercher une ville..."
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </form>

          {error && <div className="text-destructive text-center p-4">{error}</div>}

          {searchWeather && (
            <div className="mt-4">
              <WeatherCard weather={searchWeather} />
            </div>
          )}
        </div>

        {/* Grille des villes françaises */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Grandes Villes Françaises</h2>
          {loading ? (
            <div className="text-center p-8">Chargement des données météo...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {citiesWeather.map((weather, index) => (
                <WeatherCard key={weather.city.name + index} weather={weather} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

