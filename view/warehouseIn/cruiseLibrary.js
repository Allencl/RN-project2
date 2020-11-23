import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { WingBlank, WhiteSpace, Toast, Button } from '@ant-design/react-native';


class CruiseLibraryPage extends Component {
  constructor(props) {
    super(props);
  }


  /**
   * 提交
   * @param
   */
  submit = () => {

  }


  render() {
    const {navigation} = this.props;


    return (
        <ScrollView style={{paddingTop:60,backgroundColor:"white"}}>
            <WingBlank >
                <Button type="ghost" onPress={() => navigation.navigate('Convention') }>日常巡库</Button>
                <WhiteSpace />
                <WhiteSpace />

                {/* <Button type="ghost" onPress={() => navigation.navigate('Convention2') }>日常巡库2</Button> */}
                <WhiteSpace />
                <WhiteSpace />


                <Button type="ghost"  onPress={() => navigation.navigate('Issue') }>巡库问题项</Button>
                <WhiteSpace />
                <WhiteSpace />
                
                {/* <Button type="ghost"  onPress={() => navigation.navigate('Issue2') }>巡库问题项2</Button> */}

                <WhiteSpace />
                <WhiteSpace />
            </WingBlank>
        </ScrollView>
    );
  }
}



export default CruiseLibraryPage;

