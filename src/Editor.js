import React from 'react'
import _ from 'lodash/fp'

import AceEditor from 'react-ace'
import Card, {CardContent} from 'material-ui/Card'
import Grid from 'material-ui/Grid';
import {LinearProgress} from 'material-ui/Progress'
import Button from 'material-ui/Button';
import PlayArrowIcon from 'material-ui-icons/PlayArrow';
import SubdirectoryArrowRight from 'material-ui-icons/SubdirectoryArrowRight';
import Collapse from 'material-ui/transitions/Collapse';

import 'brace/mode/scala'
import 'brace/theme/crimson_editor'
import 'brace/theme/xcode'

class Editor extends React.Component {
    state = {
        input: this.props.children,
        output: undefined,
        waiting: false
    };

    run = () => {
        this.setState({waiting: true}, () => {
            const src = this.state.input;
            this.props.runProgram(src, data =>
                this.setState({waiting: false, output: data})
            );
        })
    };

    debounced = _.debounce(1000, this.run);

    onChange = input => {
        this.setState({input}, this.debounced);
    };

    onClick = () => {
        this.run();
    };

    resultBox = () => {
        if (!this.state.output) {
            return undefined;
        } else {
            // {this.state.output.status}, {this.state.output.result}, {this.state.output.message}
            return (
                <Collapse in={true}>
                    <SubdirectoryArrowRight/>
                    {this.state.output.result}
                </Collapse>);
        }
    };

    getHeight = () => (this.props.lines || 1) * 23;

    render() {
        return (
            <div>
                <Card>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={10}>

                                <AceEditor
                                    style={{width: '100%', height: this.getHeight() + 'px'}}
                                    mode='scala'
                                    theme='xcode'
                                    showGutter={false}
                                    showPrintMargin={false}
                                    highlightActiveLine={false}
                                    onChange={this.onChange}
                                    value={this.state.input}
                                    editorProps={{$blockScrolling: true}}/>
                                {this.state.waiting && <LinearProgress/>}

                            </Grid>

                            <Grid item xs={2}>
                                <Button onClick={this.onClick}>
                                    Run
                                    <PlayArrowIcon/>
                                </Button>
                            </Grid>
                        </Grid>
                        {this.resultBox()}
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default Editor