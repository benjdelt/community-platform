import * as React from 'react'
import debounce from 'debounce'
import { Map, TileLayer, ZoomControl } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import './index.css'

import { Clusters } from './Cluster'
import { Popup } from './Popup'

import {
  IMapPin,
  IMapPinDetail,
  ILatLng,
  IBoundingBox,
  IPinType,
  IMapPinWithType,
} from 'src/models/maps.models'
import { inject, observer } from 'mobx-react'
import { MapsStore } from 'src/stores/Maps/maps.store'

interface IProps {
  pins: Array<IMapPinWithType>
  filters: Array<IPinType>
  onBoundingBoxChange: (boundingBox: IBoundingBox) => void
  onPinClicked: (pin: IMapPin) => void
  activePinDetail?: IMapPinDetail
  center: ILatLng
  zoom: number
  mapRef: React.RefObject<Map>
}
interface IInjectedProps extends IProps {
  mapsStore: MapsStore
}

@inject('mapsStore')
@observer
class MapView extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
    this.handleMove = debounce(this.handleMove, 1000)
  }

  get injected() {
    return this.props as IInjectedProps
  }

  // on move end want to calculate current bounding box and notify parent
  // so that pins can be displayed as required
  private handleMove = () => {
    if (this.props.mapRef.current) {
      const boundingBox = this.props.mapRef.current.leafletElement.getBounds()
      const newBoundingBox: IBoundingBox = {
        topLeft: boundingBox.getNorthWest(),
        bottomRight: boundingBox.getSouthEast(),
      }
      this.props.onBoundingBoxChange(newBoundingBox)
    }
  }

  private pinClicked(pin: IMapPin) {
    this.injected.mapsStore.setActivePin(pin)
  }

  public render() {
    const { center, zoom, pins } = this.props
    const { activePin } = this.injected.mapsStore
    return (
      <Map
        ref={this.props.mapRef}
        className="markercluster-map"
        center={[center.lat, center.lng]}
        zoom={zoom}
        maxZoom={18}
        style={{ height: '100%', zIndex: 0 }}
        onmove={this.handleMove}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Clusters pins={pins} onPinClick={pin => this.pinClicked(pin)} />
        {activePin && <Popup activePin={activePin} map={this.props.mapRef} />}
      </Map>
    )
  }

  static defaultProps: Partial<IProps> = {
    onBoundingBoxChange: () => null,
    onPinClicked: () => null,
    pins: [],
    filters: [],
    center: { lat: 51.0, lng: 19.0 },
    zoom: 3,
  }
}

export { MapView }
