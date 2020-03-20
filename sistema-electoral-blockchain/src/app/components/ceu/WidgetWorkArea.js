/* eslint-disable default-case */
import React from 'react';
import { TypeSelection } from './TypeSelection';
import WidgetManagement from './work_areas/WidgetManagement';
import WidgetAddTable from './work_areas/WidgetAddTable';
import WidgetAddCandidate from './work_areas/WidgetAddCandidate';
import WidgetListTables from './work_areas/WidgetListTables';
import WidgetListCandidates from './work_areas/WidgetListCandidates';
import WidgetShowResults from './work_areas/WidgetShowResults';
import WidgetTransferTokens from './work_areas/WidgetTransferTokens';

/**
 * Muestra el componente que esta asociado a la opcion que selecciono el usuario en el panel lateral de acciones disponibles para el actor del CEU (Gestionar proceso, aniadir mesa, aniadir candidato, listar mesas, listar candidatos, mostrar resultados y transferir tokens)
 */
export default class WidgetWorkArea extends React.Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    //Empleado para determinar que es lo que se va renderizar dentro de este componente WidgetWorkArea
    switch (this.props.show) {
      case TypeSelection.MANAGEMENT:
        return <WidgetManagement />

      case TypeSelection.ADD_TABLE:
        return <WidgetAddTable />

      case TypeSelection.ADD_CANDIDATE:
        return <WidgetAddCandidate />

      case TypeSelection.LIST_TABLES:
        return <WidgetListTables />

      case TypeSelection.LIST_CANDIDATES:
        return <WidgetListCandidates />

      case TypeSelection.SHOW_RESULTS:
        return <WidgetShowResults />

      case TypeSelection.TRANSFER_TOKENS:
        return <WidgetTransferTokens />
    }

    //Si ninguno coincide, siendo una accion atipica, no renderiza ningun componente
    return (
      <div>

      </div>
    );
  }
}
