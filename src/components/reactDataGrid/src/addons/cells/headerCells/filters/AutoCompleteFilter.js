import React, {PropTypes} from 'react';
import ExcelColumn from '../../../../PropTypeShapes/ExcelColumn';
import Select from 'react-select';
import isEmptyArray from '../../../utils/isEmptyArray';

class AutoCompleteFilter extends React.Component {
  constructor(props) {
    super(props);
    this.getOptions = this.getOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {options: this.getOptions(), rawValue: '', placeholder: 'Search...'};
  }

  componentWillReceiveProps(newProps) {
    this.setState({options: this.getOptions(newProps)});
  }

  getOptions(newProps) {
    let props = newProps || this.props;
    let options = props.getValidFilterValues(props.column.key);
    options = options.map(o => {
      if (typeof o === 'string') {
        return { value: o, label: o };
      }
      return o;
    });
    return options;
  }

  filterValues(row, columnFilter, columnKey) {
    let include = true;
    if (columnFilter === null) {
      include = false;
    } else if (!isEmptyArray(columnFilter.filterTerm)) {
      for (let prop of columnFilter.filterTerm) {
        let checkValueIndex = row[columnKey].trim().toLowerCase().indexOf(prop.value.trim().toLowerCase());
        if (checkValueIndex === -1 || (checkValueIndex === 0 && row[columnKey] !== prop.value)) {
          include = false;
        } else {
          include = true;
          break;
        }
      }
    }
    return include;
  }

  handleChange(value) {
    let filters = value;
    this.setState({filters});
    this.props.onChange({filterTerm: filters, column: this.props.column, rawValue: value, filterValues: this.filterValues });
  }

  render() {
    let filterName = 'filter-' + this.props.column.key;
    return (
      <div style={{width: (this.props.column.width * 0.9)}}>
      <Select
          name={filterName}
          options={this.state.options}
          placeholder={this.state.placeholder}
          onChange={this.handleChange}
          escapeClearsValue={true}
          multi={true}
          value={this.state.filters}
      />
      </div>
    );
  }
}

AutoCompleteFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
  column: React.PropTypes.shape(ExcelColumn),
  getValidFilterValues: PropTypes.func
};

export default AutoCompleteFilter;
