'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { UseLeafletMapArgs, UseLeafletMapReturn, LocationData } from './types'

type LType = typeof import('leaflet')
type LeafletMap = import('leaflet').Map
type LeafletMarker = import('leaflet').Marker

function buildMarkerHtml(active: boolean): string {
  const dotClass = active
    ? 'cr-marker-dot cr-marker-dot-active'
    : 'cr-marker-dot'
  return `<div class="cr-marker-wrap" aria-hidden="true"><span class="${dotClass}"></span></div>`
}

export function useLeafletMap({
  containerRef,
  locations,
  activeId,
  onMarkerClick,
}: UseLeafletMapArgs): UseLeafletMapReturn {
  const mapRef = useRef<LeafletMap | null>(null)
  // Native JS Map (not Leaflet Map) — stores marker instances keyed by location id
  const markersRef = useRef<globalThis.Map<string, LeafletMarker>>(
    new globalThis.Map()
  )
  const LRef = useRef<LType | null>(null)
  const activeIdRef = useRef<string | null>(activeId)
  const onMarkerClickRef = useRef(onMarkerClick)

  // Keep refs current without re-running effects
  useEffect(() => { activeIdRef.current = activeId }, [activeId])
  useEffect(() => { onMarkerClickRef.current = onMarkerClick }, [onMarkerClick])

  // Sync marker icons + flyTo when activeId changes (only after map is ready)
  useEffect(() => {
    const L = LRef.current
    if (!L) return

    markersRef.current.forEach((marker, id) => {
      marker.setIcon(
        L.divIcon({
          html: buildMarkerHtml(id === activeId),
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })
      )
    })

    if (activeId && mapRef.current) {
      const loc = locations.find((l) => l.id === activeId)
      if (loc) {
        mapRef.current.flyTo([loc.coords.lat, loc.coords.lng], 15, {
          duration: 0.8,
        })
      }
    }
  }, [activeId, locations])

  // Init map — runs once on mount
  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) return
    const markers = markersRef.current

    // isMounted guards the async against StrictMode double-invoke:
    // cleanup sets it to false before the first async resolves on the
    // second mount, preventing "Map container is already initialized".
    let isMounted = true

    ;(async () => {
      const L = await import('leaflet')
      // Bail if cleanup ran while we were awaiting the import
      if (!isMounted || !containerRef.current) return

      LRef.current = L

      const map = L.map(container, {
        scrollWheelZoom: false,
        dragging: true,
        zoomControl: true,
        attributionControl: true,
      })

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
            '&copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map)

      const bounds: [number, number][] = []

      locations.forEach((loc: LocationData) => {
        const icon = L.divIcon({
          html: buildMarkerHtml(loc.id === activeIdRef.current),
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })

        const marker = L.marker([loc.coords.lat, loc.coords.lng], {
          icon,
          title: `Coffee Relief – ${loc.name}`,
          alt: `Coffee Relief – ${loc.name}`,
        }).addTo(map)

        marker.on('click', () => onMarkerClickRef.current(loc.id))
        markers.set(loc.id, marker)
        bounds.push([loc.coords.lat, loc.coords.lng])
      })

      map.fitBounds(bounds as [[number, number], [number, number]], {
        padding: [60, 60],
      })

      mapRef.current = map
    })()

    return () => {
      isMounted = false
      mapRef.current?.remove()
      mapRef.current = null
      markers.clear()
      LRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const flyTo = useCallback(
    (id: string) => {
      const loc = locations.find((l) => l.id === id)
      if (!loc || !mapRef.current) return
      mapRef.current.flyTo([loc.coords.lat, loc.coords.lng], 15, {
        duration: 0.8,
      })
    },
    [locations]
  )

  return { flyTo }
}
